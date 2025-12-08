# FARADO Global - Production Deployment Guide (Timeweb)

## Overview
This guide describes how to deploy FARADO Global to a Timeweb VPS server from the GitHub repository.

## Prerequisites
- Ubuntu 20.04+ VPS on Timeweb
- Node.js 20.x installed
- PostgreSQL 15+ database
- PM2 for process management
- Nginx as reverse proxy

## Server Setup

### 1. Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should show v20.x
```

### 2. Install PM2
```bash
sudo npm install -g pm2
```

### 3. Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Create Database
```bash
sudo -u postgres psql

CREATE USER farado WITH PASSWORD 'your_secure_password';
CREATE DATABASE farado_db OWNER farado;
GRANT ALL PRIVILEGES ON DATABASE farado_db TO farado;
\q
```

### 5. Install Nginx
```bash
sudo apt install nginx
sudo systemctl enable nginx
```

## Application Setup

### 1. Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/greyversarex/Farado.git farado
sudo chown -R $USER:$USER farado
cd farado
```

### 2. Install Dependencies
```bash
npm ci
```

### 3. Create Environment File
```bash
cp .env.example .env
nano .env
```

Configure the following variables:
```env
DATABASE_URL=postgresql://farado:your_secure_password@localhost:5432/farado_db
PGHOST=localhost
PGPORT=5432
PGUSER=farado
PGPASSWORD=your_secure_password
PGDATABASE=farado_db
SESSION_SECRET=generate-a-random-64-character-string-here
NODE_ENV=production
PORT=5000
```

Generate a secure SESSION_SECRET:
```bash
openssl rand -hex 32
```

### 4. Build Application
```bash
npm run build
```

### 5. Initialize Database Schema
```bash
npm run db:push
```

### 6. Create Admin Users (First Time Only)
Create a file `create_users.cjs`:
```javascript
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const users = [
  { username: 'admin', password: 'your_admin_password', fullName: 'Administrator', role: 'admin' },
  { username: 'Alisher', password: 'your_password', fullName: 'Alisher', role: 'manager' },
  { username: 'Barumand', password: 'your_password', fullName: 'Barumand', role: 'manager' },
  { username: 'Bahtiyor', password: 'your_password', fullName: 'Bahtiyor', role: 'manager' },
  { username: 'Akmal', password: 'your_password', fullName: 'Akmal', role: 'manager' }
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
      
      console.log(`Created user: ${user.username}`);
    }
    console.log('All users created successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

createUsers();
```

Run it once:
```bash
node create_users.cjs
rm create_users.cjs  # Delete after use
```

## PM2 Configuration

### 1. Create PM2 Ecosystem File
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'farado',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
```

### 2. Start Application
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions to enable auto-start
```

## Nginx Configuration

### 1. Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/farado
```

```nginx
server {
    listen 80;
    server_name farado.global www.farado.global;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/farado /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Setup SSL with Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d farado.global -d www.farado.global
```

## Deployment Script

Create `deploy.sh` in the project root:
```bash
#!/bin/bash
set -e

echo "=== FARADO Deployment Script ==="

# Navigate to project directory
cd /var/www/farado

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build application
echo "Building application..."
npm run build

# Run database migrations (safe, won't delete data)
echo "Running database migrations..."
npm run db:push

# Restart application
echo "Restarting application..."
pm2 restart farado

# Health check
sleep 3
echo "Checking health..."
curl -s http://localhost:5000/api/health | head -1

echo "=== Deployment Complete ==="
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Updating the Application

When you push changes to GitHub:

```bash
cd /var/www/farado
./deploy.sh
```

**What the script does:**
1. Creates a database backup BEFORE any changes
2. Pulls latest code from GitHub
3. Installs new dependencies
4. Builds the application
5. Runs database schema sync (adds new columns/tables)
6. Restarts the application

**Data Safety:**
- Automatic backup is created before every deployment
- Backups are stored in `/var/backups/farado/`
- Last 10 backups are kept automatically
- If deployment fails, your data can be restored from backup

**Important Warning:**
- `drizzle-kit push` primarily ADDS new schema elements
- If you RENAME or REMOVE columns in schema.ts, you may lose data
- Always verify backups exist before deploying schema changes
- For destructive schema changes, migrate data manually first

**Restore from backup:**
```bash
psql -U farado -h localhost farado_db < /var/backups/farado/backup_YYYYMMDD_HHMMSS.sql
```

## Initial Users (Auto-Created)

When the application starts on a fresh database, it automatically creates these users:

| Логин | Пароль | Роль | Имя |
|-------|--------|------|-----|
| admin | admin123 | admin | Администратор |
| alisher | Alisher2024! | manager | Алишер |
| barumand | Barumand2024! | manager | Барумонд |
| bahtiyor | Bahtiyor2024! | manager | Бахтиёр |
| akmal | Akmal2024! | manager | Акмал |

**Important:** Change these passwords after first login!

Users are only created if the database has no existing users. This ensures:
- Fresh deployments get all users automatically
- Existing user data is never overwritten

## Database Backup

### Create Backup
```bash
pg_dump -U farado -h localhost farado_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Backup
```bash
psql -U farado -h localhost farado_db < backup_file.sql
```

### Automated Daily Backups
```bash
sudo nano /etc/cron.daily/farado-backup
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/farado"
mkdir -p $BACKUP_DIR
pg_dump -U farado -h localhost farado_db > $BACKUP_DIR/backup_$(date +%Y%m%d).sql
find $BACKUP_DIR -mtime +7 -delete  # Keep only last 7 days
```

```bash
sudo chmod +x /etc/cron.daily/farado-backup
```

## Monitoring

### Check Application Status
```bash
pm2 status
pm2 logs farado
```

### Health Check Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","database":"connected"}
```

## Troubleshooting

### Application Won't Start
```bash
pm2 logs farado --lines 100
```

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U farado -h localhost -d farado_db -c "SELECT 1;"
```

### Nginx Issues
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

## Security Checklist

- [ ] Change default passwords for all users
- [ ] Use strong SESSION_SECRET (64+ characters)
- [ ] Enable UFW firewall (allow 22, 80, 443)
- [ ] Keep system packages updated
- [ ] Setup automated backups
- [ ] Configure fail2ban for SSH protection
