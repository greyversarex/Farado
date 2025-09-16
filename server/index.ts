import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase, pool } from "./db";

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.telegram.org"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP за окно
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Более строгий rate limit для API аутентификации
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 попыток логина за окно
  message: {
    error: "Too many login attempts from this IP, please try again later.",
    retryAfter: 15 * 60 * 1000
  },
  skipSuccessfulRequests: true,
});

// Trust proxy for rate limiting (needed for Replit environment)
app.set('trust proxy', 1);

// Применяем общий limiter ко всем запросам
app.use(limiter);

// Применяем строгий limiter к auth endpoints
app.use('/api/admin/login', authLimiter);

// Session setup will be done after environment validation

// Serve favicon files explicitly
app.get('/favicon.ico', (req, res) => {
  res.sendFile('favicon.ico', { root: '.' });
});
app.get('/favicon.png', (req, res) => {
  res.sendFile('favicon.png', { root: '.' });
});
app.get('/favicon.svg', (req, res) => {
  res.sendFile('favicon.svg', { root: '.' });
});
app.get('/android-chrome-192x192.png', (req, res) => {
  res.sendFile('android-chrome-192x192.png', { root: '.' });
});
app.get('/site.webmanifest', (req, res) => {
  res.sendFile('site.webmanifest', { root: '.' });
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve static files from client/public in development
if (process.env.NODE_ENV === "development") {
  app.use(express.static('client/public'));
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Environment variable validation
function validateEnvironment() {
  const requiredVars = ['DATABASE_URL'];
  
  // In production, SESSION_SECRET is also required for security
  if (process.env.NODE_ENV === 'production') {
    requiredVars.push('SESSION_SECRET');
  }
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // FAIL startup if using default SESSION_SECRET in production (security risk)
  if (process.env.NODE_ENV === 'production') {
    if (process.env.SESSION_SECRET === 'farado-secret-key-change-in-production') {
      throw new Error('SECURITY ERROR: Default SESSION_SECRET cannot be used in production! Please set a secure SESSION_SECRET environment variable.');
    }
  }
  
  log('Environment variables validated successfully');
}

// Graceful shutdown handler
function setupGracefulShutdown(server: any, sessionStore?: any) {
  let shuttingDown = false;
  
  const gracefulShutdown = async (signal: string, exitCode: number = 0) => {
    if (shuttingDown) {
      log(`Already shutting down, ignoring ${signal}`);
      return;
    }
    shuttingDown = true;
    
    log(`Received ${signal}, shutting down gracefully...`);
    
    // Close HTTP server first
    server.close(async () => {
      log('HTTP server closed');
      
      try {
        // Close session store in production
        if (sessionStore && typeof sessionStore.close === 'function') {
          await sessionStore.close();
          log('Session store closed');
        }
        
        // Close database pool connections
        await pool.end();
        log('Database connections closed');
      } catch (error) {
        log(`Error closing connections: ${error}`);
      }
      
      process.exit(exitCode);
    });
    
    // Force close after 30 seconds
    setTimeout(() => {
      log('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  return gracefulShutdown;
}

(async () => {
  try {
    log('Starting application...');
    
    // Validate required environment variables
    validateEnvironment();
    
    // Setup session configuration after environment validation
    log('Configuring session middleware...');
    const isProduction = process.env.NODE_ENV === 'production';
    const PgSession = ConnectPgSimple(session);
    
    // Trust proxy for secure cookies in production
    if (isProduction) {
      app.set('trust proxy', 1);
    }

    // Create session store (use PostgreSQL in production, memory store in development)
    const sessionStore = isProduction 
      ? new PgSession({
          pool: pool,
          tableName: 'user_sessions',
          createTableIfMissing: true
        })
      : undefined; // Use default memory store in development

    app.use(session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || 'farado-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      name: 'sessionId', // Change default session name for security
      cookie: {
        secure: isProduction, // Secure cookies in production (HTTPS required)
        httpOnly: true, // Prevent XSS attacks
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: isProduction ? 'strict' : 'lax' // CSRF protection
      }
    }));
    log('Session middleware configured successfully');
    
    // Initialize database tables first
    log('Initializing database...');
    await initializeDatabase();
    log('Database initialization completed');
    
    // Register API routes
    log('Registering routes...');
    const server = await registerRoutes(app);
    log('Routes registered successfully');

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      log(`Error: ${status} - ${message}`);
      res.status(status).json({ message });
    });

    // Setup development or production static file serving
    if (process.env.NODE_ENV === "development") {
      log('Setting up Vite for development...');
      await setupVite(app, server);
      log('Vite setup completed');
    } else {
      log('Setting up static file serving for production...');
      serveStatic(app);
      log('Static file serving setup completed');
    }

    // Start the server
    const port = 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`Application successfully started on port ${port}`);
      log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Setup graceful shutdown
    const gracefulShutdown = setupGracefulShutdown(server, sessionStore);
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
      console.error('Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection', 1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      log(`Uncaught Exception: ${error.message}`);
      console.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException', 1);
    });
    
  } catch (error) {
    log(`Failed to start application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('Startup error details:', error);
    process.exit(1);
  }
})();
