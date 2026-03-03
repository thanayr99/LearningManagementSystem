#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f ".env" ]]; then
  echo "Missing deploy/.env file"
  exit 1
fi

mkdir -p backups
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
DB_NAME="$(grep '^MYSQL_DB=' .env | cut -d'=' -f2)"
DB_PASS="$(grep '^MYSQL_PASSWORD=' .env | cut -d'=' -f2)"

docker compose -f docker-compose.prod.yml exec -T db \
  sh -c "mysqldump -uroot -p${DB_PASS} ${DB_NAME}" > "backups/${DB_NAME}_${TIMESTAMP}.sql"

echo "Backup created: backups/${DB_NAME}_${TIMESTAMP}.sql"
