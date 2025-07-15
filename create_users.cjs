const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const users = [
  { username: 'Barumand', password: 'bar40020', fullName: 'Barumand' },
  { username: 'Akmal', password: 'ak89090', fullName: 'Akmal' },
  { username: 'Alisher', password: 'sher777', fullName: 'Alisher' },
  { username: 'Baha', password: 'jigarak200', fullName: 'Baha' },
  { username: 'Umed', password: 'admin321', fullName: 'Umed' }
];

async function createUsers() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await pool.query(`
        INSERT INTO admin_users (username, password, full_name) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (username) DO UPDATE SET 
          password = EXCLUDED.password,
          full_name = EXCLUDED.full_name
      `, [user.username, hashedPassword, user.fullName]);
      
      console.log(`Created user: ${user.username}`);
    }
    
    console.log('All users created successfully!');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await pool.end();
  }
}

createUsers();