import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";
import bcrypt from 'bcrypt';

// Configure Neon for serverless/Autoscale deployments
// In production (Autoscale), use fetch instead of WebSocket
// WebSocket connections are not supported in Autoscale deployments
if (process.env.NODE_ENV === 'production') {
  // Use fetch for Autoscale deployments
  neonConfig.fetchConnectionCache = true;
} else {
  // In development, we can use WebSocket for better performance
  import('ws').then((ws) => {
    neonConfig.webSocketConstructor = ws.default;
  });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Initialize database tables
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test database connection first
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    
    // Only seed admin user in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Seeding admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(`
        INSERT INTO admin_users (username, password, full_name, role, is_active) 
        VALUES ('admin', $1, 'Administrator', 'admin', true) 
        ON CONFLICT (username) DO NOTHING;
      `, [hashedPassword]);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}
