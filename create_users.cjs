const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const users = [
  { username: 'admin', password: 'admin123', fullName: 'Администратор', role: 'admin' },
  { username: 'Alisher', password: 'sher777', fullName: 'Alisher', role: 'manager' },
  { username: 'Barumand', password: 'bar40020', fullName: 'Barumand', role: 'manager' },
  { username: 'Bahtiyor', password: 'baht2024', fullName: 'Bahtiyor', role: 'manager' },
  { username: 'Akmal', password: 'ak89090', fullName: 'Akmal', role: 'manager' }
];

async function createUsers() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await pool.query(`
        INSERT INTO admin_users (username, password, full_name, role) 
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT (username) DO UPDATE SET 
          password = EXCLUDED.password,
          full_name = EXCLUDED.full_name,
          role = EXCLUDED.role
      `, [user.username, hashedPassword, user.fullName, user.role]);
      
      console.log(`Created user: ${user.username} (${user.role})`);
    }
    
    console.log('All users created successfully!');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await pool.end();
  }
}

createUsers();
