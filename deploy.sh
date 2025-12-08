#!/bin/bash
set -e

echo "=== FARADO Deployment Script ==="
echo "Started at: $(date)"

# Configuration
PROJECT_DIR="/var/www/farado"
BACKUP_DIR="/var/backups/farado"

# Navigate to project directory
cd $PROJECT_DIR

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Step 1: Create database backup BEFORE any changes
echo ""
echo "[1/6] Creating database backup..."
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump -U farado -h localhost farado_db > "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"

# Keep only last 10 backups
ls -t $BACKUP_DIR/backup_*.sql 2>/dev/null | tail -n +11 | xargs -r rm

# Step 2: Pull latest changes
echo ""
echo "[2/6] Pulling latest changes from GitHub..."
git pull origin main

# Step 3: Install dependencies
echo ""
echo "[3/6] Installing dependencies..."
npm ci --production=false

# Step 4: Build application
echo ""
echo "[4/6] Building application..."
npm run build

# Step 5: Database schema sync
echo ""
echo "[5/6] Syncing database schema..."
echo "NOTE: Drizzle push only ADDS new columns/tables. It does NOT delete existing data."
echo "If you renamed or removed columns in schema, restore from backup and migrate manually."
npm run db:push || {
    echo "WARNING: Schema push failed. Your data is safe in: $BACKUP_FILE"
    echo "Restore with: psql -U farado -h localhost farado_db < $BACKUP_FILE"
    exit 1
}

# Step 6: Restart application
echo ""
echo "[6/6] Restarting application..."
pm2 restart farado

# Wait for startup
sleep 3

# Health check
echo ""
echo "Health check..."
HEALTH=$(curl -s http://localhost:5000/api/health)
echo "Response: $HEALTH"

echo ""
echo "=== Deployment Complete ==="
echo "Backup saved: $BACKUP_FILE"
echo "Finished at: $(date)"
