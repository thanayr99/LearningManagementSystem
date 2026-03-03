# Pre-Deployment Checklist (DigitalOcean + Vercel)

## 1) Infrastructure
- [ ] Create a DigitalOcean Ubuntu 24.04 droplet (`s-1vcpu-1gb` recommended).
- [ ] Reserve a static IP for the droplet.
- [ ] Add DNS `A` record: `api.yourdomain.com -> droplet_ip`.
- [ ] Add DNS `A`/`CNAME` for frontend domain (optional, Vercel managed).

## 2) Server Hardening
- [ ] Create non-root sudo user.
- [ ] Disable password auth and enable SSH keys.
- [ ] Enable UFW:
  - [ ] `22/tcp`
  - [ ] `80/tcp`
  - [ ] `443/tcp`
- [ ] Install fail2ban (recommended).
- [ ] Keep OS packages updated.

## 3) App Secrets & Config
- [ ] Copy `deploy/.env.prod.example` to `deploy/.env`.
- [ ] Set strong `MYSQL_PASSWORD`.
- [ ] Set strong `JWT_SECRET` (>= 64 chars random).
- [ ] Set correct `BACKEND_DOMAIN`.
- [ ] Set `CORS_ALLOWED_ORIGINS` including exact Vercel frontend URL(s).

## 4) Backend Stack
- [ ] Install Docker + Docker Compose plugin.
- [ ] Deploy stack:
  - [ ] `docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build`
- [ ] Confirm health:
  - [ ] `https://api.yourdomain.com/actuator/health`
- [ ] Confirm API auth route:
  - [ ] `POST https://api.yourdomain.com/api/auth/login`

## 5) Frontend (Vercel)
- [ ] In Vercel project env:
  - [ ] `VITE_API_BASE_URL=https://api.yourdomain.com/api`
- [ ] Redeploy frontend.
- [ ] Confirm frontend login/register calls hit production API.

## 6) Data Safety
- [ ] Add daily MySQL backup cron:
  - [ ] `deploy/scripts/backup-mysql.sh`
- [ ] Test restore once from backup.

## 7) Security Validation
- [ ] Weak password registration rejected (400).
- [ ] Unauthorized file URL access rejected (403/404).
- [ ] JWT required for protected endpoints.
- [ ] CORS allows only known frontend origins.

## 8) Monitoring
- [ ] Set uptime checks for:
  - [ ] `GET /actuator/health`
  - [ ] `GET /` frontend
- [ ] Set alerting email/Slack (optional).
