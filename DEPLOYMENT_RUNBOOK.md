# Deployment Runbook (DigitalOcean Droplet + Vercel Frontend)

## A) One-time server setup (on droplet)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git ufw

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## B) Pull project
```bash
git clone https://github.com/thanayr99/LearningManagementSystem.git
cd LearningManagementSystem
```

## C) Configure production env
```bash
cp deploy/.env.prod.example deploy/.env
nano deploy/.env
```
Set:
- `BACKEND_DOMAIN=api.yourdomain.com`
- `MYSQL_PASSWORD=...`
- `JWT_SECRET=...`
- `CORS_ALLOWED_ORIGINS=https://learning-management-system-pi-three.vercel.app`

## D) Start production stack
```bash
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build
docker compose -f deploy/docker-compose.prod.yml ps
```

## E) Verify backend
```bash
curl https://api.yourdomain.com/actuator/health
```

## F) Point frontend (Vercel)
In Vercel project settings:
- Environment Variable: `VITE_API_BASE_URL=https://api.yourdomain.com/api`

Redeploy Vercel frontend.

## G) Add backup cron
```bash
chmod +x deploy/scripts/backup-mysql.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /bin/bash $(pwd)/deploy/scripts/backup-mysql.sh >> $(pwd)/deploy/backups/backup.log 2>&1") | crontab -
```

## H) Update process
```bash
git pull
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build
```
