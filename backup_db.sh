#!/bin/bash

# Define variables
CONTAINER_NAME="swamp-soul-web-web-app-1"
DB_PATH="/app/server/db/storage/prod.sqlite3"
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).sqlite3"
HOST_BACKUP_DIR="./data/backups"

# Create backup directory if it doesn't exist
mkdir -p $HOST_BACKUP_DIR

# Run the SQLite backup command inside the container
docker exec $CONTAINER_NAME sqlite3 $DB_PATH ".backup '/app/server/db/storage/$BACKUP_NAME'"

# Move the backup from the shared volume folder to a dedicated backup folder on the host
mv ./data/$BACKUP_NAME $HOST_BACKUP_DIR/$BACKUP_NAME

# Keep only the last 7 days of backups to save space
find $HOST_BACKUP_DIR -type f -mtime +7 -name "*.sqlite3" -delete

echo "Backup created: $HOST_BACKUP_DIR/$BACKUP_NAME"
