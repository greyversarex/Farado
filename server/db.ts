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

async function executeQuery(sql: string, params?: any[]) {
  if (pgPool) {
    return pgPool.query(sql, params);
  } else if (pool && pool instanceof NeonPool) {
    return pool.query(sql, params);
  } else {
    // HTTP driver: interpolate params into query (values are hardcoded/safe)
    let interpolated = sql;
    if (params) {
      params.forEach((p, i) => {
        const escaped = typeof p === 'string' ? `'${p.replace(/'/g, "''")}'` : String(p);
        interpolated = interpolated.replace(`$${i + 1}`, escaped);
      });
    }
    return db.execute(interpolated);
  }
}

async function seedDefaultHubs() {
  try {
    const result = await executeQuery('SELECT COUNT(*) as count FROM hubs');
    const count = parseInt((result as any).rows?.[0]?.count || '0');
    if (count > 0) {
      console.log(`Found ${count} existing hubs, skipping hub seed`);
      return;
    }
  } catch {
    console.log('hubs table does not exist yet, skipping hub seed');
    return;
  }

  console.log('No hubs found, seeding default hubs...');
  const defaultHubs = [
    { name: 'Гуанчжоу', nameChinese: '广州', description: 'Наш хаб в Гуанчжоу специализируется на широком спектре товаров, включая одежду, электронику, автозапчасти и кожгалантерею.', pricePerKg: '1.2', pricePerCubic: '220', image: '/attached_assets/i (1)_1761901428135.webp', sortOrder: 1 },
    { name: 'Фошань', nameChinese: '佛山', description: 'Склад в Фошане – ваш доступ к огромному ассортименту мебели, керамической плитки, сантехники и других строительных материалов.', pricePerKg: '1.2', pricePerCubic: '220', image: '/attached_assets/maxresdefault_1761901431824.jpg', sortOrder: 2 },
    { name: 'Урумчи', nameChinese: '乌鲁木齐', description: 'Наш стратегический логистический узел для доставки товаров в Центральную Азию, Россию и обратно. Он специализируется на транзитных грузах и товарах для приграничной торговли.', pricePerKg: '1.0', pricePerCubic: '190', image: '/attached_assets/i (3)_1761901428135.webp', sortOrder: 3 },
    { name: 'Иву', nameChinese: '义乌', description: 'Город известен как центр по оптовым мелким товарам. Здесь вы найдете всё: от бижутерии, игрушек и сувениров до хозяйственных мелочей и фурнитуры.', pricePerKg: '1.1', pricePerCubic: '210', image: '/attached_assets/i (4)_1761901428136.webp', sortOrder: 4 },
    { name: 'Кашгар', nameChinese: '喀什', description: 'Склад в Кашгаре ориентирован на торговые потоки со странами Центральной Азии. Этот древний город специализируется на традиционных товарах, ремесленных изделиях и местной сельхозпродукции.', pricePerKg: '0.80', pricePerCubic: '180', image: '/attached_assets/i (5)_1761901428136.webp', sortOrder: 5 },
  ];

  for (const hub of defaultHubs) {
    await executeQuery(
      `INSERT INTO hubs (name, name_chinese, description, price_per_kg, price_per_cubic, image, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) ON CONFLICT DO NOTHING`,
      [hub.name, hub.nameChinese, hub.description, hub.pricePerKg, hub.pricePerCubic, hub.image, hub.sortOrder]
    );
  }
  console.log('Default hubs seeded successfully');
}

async function seedDefaultTeamMembers() {
  try {
    const result = await executeQuery('SELECT COUNT(*) as count FROM team_members');
    const count = parseInt((result as any).rows?.[0]?.count || '0');
    if (count > 0) {
      console.log(`Found ${count} existing team members, skipping team seed`);
      return;
    }
  } catch {
    console.log('team_members table does not exist yet, skipping team seed');
    return;
  }

  console.log('No team members found, seeding default team members...');
  const defaultTeam = [
    { name: 'Бахтиёр Курбанов', position: 'Руководитель отдела логистики в РТ', experience: '5+ лет опыта в логистике', description: 'Эксперт по организации логистических маршрутов и таможенному оформлению', image: '/attached_assets/photo_2025-11-19_16-43-30_1763552620386.jpg', imagePosition: 'object-center', sortOrder: 1 },
    { name: 'Алишер Каноатзода', position: 'Представитель компании в РТ', experience: '7+ лет опыта в международной торговле', description: 'Специалист по организации и развитию бизнеса с Китаем', image: '/attached_assets/IMG_4503_1763365902466.PNG', imagePosition: 'object-center', sortOrder: 2 },
    { name: 'Умед Сафарализода', position: 'Руководитель отдела маркетинга', experience: '5+ лет опыта в маркетинге', description: 'Стратег цифрового маркетинга и развития бренда на рынках Центральной Азии', image: '/attached_assets/photo_2023-12-15_14-28-45_1762861683805.jpg', imagePosition: 'object-[center_35%] scale-95', sortOrder: 3 },
    { name: 'Хуэй Чи', position: 'Руководитель отдела закупок', experience: '10+ лет в сфере закупок', description: 'Специалист по поиску поставщиков и контролю качества в Китае', image: '/attached_assets/hui_chi_photo.jpg', imagePosition: 'object-[center_40%]', sortOrder: 4 },
    { name: 'Миньян Пэн', position: 'Менеджер по закупкам в Гуанчжоу', experience: '5+ лет опыта в закупках', description: 'Специалист по поиску производителей и контролю качества товаров в Южном Китае', image: '/attached_assets/photo_2025-11-10_14-00-36 (3)_1762859892177.jpg', imagePosition: 'object-[center_40%]', sortOrder: 5 },
    { name: 'Цзяньжун Чжу', position: 'Специалист по логистике в Китае', experience: '8+ лет опыта в логистике', description: 'Координатор логистических операций и отгрузок из портов Южного Китая', image: '/attached_assets/photo_2025-11-10_14-00-36 (4)_1762860764854.jpg', imagePosition: 'object-center', sortOrder: 6 },
  ];

  for (const member of defaultTeam) {
    await executeQuery(
      `INSERT INTO team_members (name, position, experience, description, image, image_position, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) ON CONFLICT DO NOTHING`,
      [member.name, member.position, member.experience, member.description, member.image, member.imagePosition, member.sortOrder]
    );
  }
  console.log('Default team members seeded successfully');
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
    await seedDefaultHubs();
    await seedDefaultTeamMembers();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}
