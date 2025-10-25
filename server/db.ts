import { neon, neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";
import bcrypt from 'bcrypt';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Production (Autoscale): Use HTTP fetch-based connection (no WebSocket)
// Development: Use WebSocket-based connection for better performance
const isProduction = process.env.NODE_ENV === 'production';

// Initialize database connection based on environment
let db: ReturnType<typeof drizzleHttp> | ReturnType<typeof drizzleServerless>;
let pool: Pool | null = null;
let dbInitialized = false;

// Initialize database connection
async function initDb() {
  if (dbInitialized) return;
  
  if (isProduction) {
    // Use HTTP-based driver for Autoscale deployments (no WebSocket)
    console.log('Using Neon HTTP driver for production (Autoscale)');
    const sql = neon(process.env.DATABASE_URL!);
    db = drizzleHttp(sql, { schema });
  } else {
    // Use WebSocket-based driver for development
    console.log('Using Neon serverless driver for development');
    // Dynamic import for ES modules
    const { default: ws } = await import('ws');
    neonConfig.webSocketConstructor = ws;
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzleServerless({ client: pool, schema });
  }
  
  dbInitialized = true;
}

// Export a promise that ensures db is initialized before use
export const dbReady = initDb();

// Export db and pool - must await dbReady before use
export { db, pool };

// Initialize database tables
export async function initializeDatabase() {
  // Ensure db is initialized first
  await dbReady;
  
  try {
    console.log('Initializing database...');
    
    // Test database connection
    if (isProduction) {
      // For HTTP driver, use drizzle query
      const result = await db.execute('SELECT NOW()');
      console.log('Database connection successful (HTTP)');
    } else if (pool) {
      // For serverless driver, use pool query
      const result = await pool.query('SELECT NOW()');
      console.log('Database connection successful:', result.rows[0]);
    }
    
    // Only seed admin user in development environment
    if (!isProduction) {
      console.log('Development mode: Seeding admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      if (pool) {
        await pool.query(`
          INSERT INTO admin_users (username, password, full_name, role, is_active) 
          VALUES ('admin', $1, 'Administrator', 'admin', true) 
          ON CONFLICT (username) DO NOTHING;
        `, [hashedPassword]);
      }
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}
