import { neon, neonConfig, Pool as NeonPool } from '@neondatabase/serverless';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool as PgPool } from 'pg';
import * as schema from "@shared/schema";
import bcrypt from 'bcrypt';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const isProduction = process.env.NODE_ENV === 'production';
const isLocalPostgres = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1');

let db: ReturnType<typeof drizzleHttp> | ReturnType<typeof drizzleServerless> | ReturnType<typeof drizzlePg>;
let pool: NeonPool | PgPool | null = null;
let pgPool: PgPool | null = null;
let dbInitialized = false;

async function initDb() {
  if (dbInitialized) return;
  
  if (isLocalPostgres) {
    console.log('Using standard PostgreSQL driver for local database');
    pgPool = new PgPool({ connectionString: process.env.DATABASE_URL });
    pool = pgPool;
    db = drizzlePg({ client: pgPool, schema });
  } else if (isProduction) {
    console.log('Using Neon HTTP driver for production (Autoscale)');
    const sql = neon(process.env.DATABASE_URL!);
    db = drizzleHttp(sql, { schema });
  } else {
    console.log('Using Neon serverless driver for development');
    const { default: ws } = await import('ws');
    neonConfig.webSocketConstructor = ws;
    pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
    db = drizzleServerless({ client: pool, schema });
  }
  
  dbInitialized = true;
}

export const dbReady = initDb();
export { db, pool };

async function seedInitialUsers() {
  let userCount = 0;
  
  try {
    if (pgPool) {
      const result = await pgPool.query('SELECT COUNT(*) as count FROM admin_users');
      userCount = parseInt(result.rows[0]?.count || '0');
    } else if (pool && pool instanceof NeonPool) {
      const result = await pool.query('SELECT COUNT(*) as count FROM admin_users');
      userCount = parseInt(result.rows[0]?.count || '0');
    } else {
      const result = await db.execute('SELECT COUNT(*) as count FROM admin_users');
      userCount = parseInt((result as any).rows?.[0]?.count || '0');
    }
  } catch (error) {
    console.log('admin_users table does not exist yet, will be created by migrations');
    return;
  }
  
  if (userCount > 0) {
    console.log(`Found ${userCount} existing users, skipping seed`);
    return;
  }
  
  console.log('No users found, creating initial users...');
  
  const users = [
    { username: 'admin', password: 'admin123', fullName: 'Администратор', role: 'admin' },
    { username: 'alisher', password: 'Alisher2024!', fullName: 'Алишер', role: 'manager' },
    { username: 'barumand', password: 'Barumand2024!', fullName: 'Барумонд', role: 'manager' },
    { username: 'bahtiyor', password: 'Bahtiyor2024!', fullName: 'Бахтиёр', role: 'manager' },
    { username: 'akmal', password: 'Akmal2024!', fullName: 'Акмал', role: 'manager' },
  ];
  
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    if (pgPool) {
      await pgPool.query(`
        INSERT INTO admin_users (username, password, full_name, role, is_active) 
        VALUES ($1, $2, $3, $4, true) 
        ON CONFLICT (username) DO NOTHING
      `, [user.username, hashedPassword, user.fullName, user.role]);
    } else if (pool && pool instanceof NeonPool) {
      await pool.query(`
        INSERT INTO admin_users (username, password, full_name, role, is_active) 
        VALUES ($1, $2, $3, $4, true) 
        ON CONFLICT (username) DO NOTHING
      `, [user.username, hashedPassword, user.fullName, user.role]);
    } else {
      await db.execute(`
        INSERT INTO admin_users (username, password, full_name, role, is_active) 
        VALUES ('${user.username}', '${hashedPassword}', '${user.fullName}', '${user.role}', true) 
        ON CONFLICT (username) DO NOTHING
      `);
    }
    
    console.log(`Created user: ${user.username} (${user.role})`);
  }
  
  console.log('Initial users created successfully');
}

export async function initializeDatabase() {
  await dbReady;
  
  try {
    console.log('Initializing database...');
    
    if (pgPool) {
      const result = await pgPool.query('SELECT NOW()');
      console.log('Database connection successful:', result.rows[0]);
    } else if (pool && pool instanceof NeonPool) {
      const result = await pool.query('SELECT NOW()');
      console.log('Database connection successful:', result.rows[0]);
    } else {
      const result = await db.execute('SELECT NOW()');
      console.log('Database connection successful (HTTP)');
    }
    
    await seedInitialUsers();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}
