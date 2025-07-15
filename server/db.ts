import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

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
    
    // Update existing admin user or insert if not exists
    await pool.query(`
      INSERT INTO admin_users (username, password, full_name, role, is_active) 
      VALUES ('admin', 'admin123', 'Administrator', 'admin', true) 
      ON CONFLICT (username) DO UPDATE SET 
        password = EXCLUDED.password,
        full_name = EXCLUDED.full_name,
        is_active = EXCLUDED.is_active;
    `);
    
    console.log('Database initialized successfully');
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}