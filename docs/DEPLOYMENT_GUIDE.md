# Production Deployment Guide (AWS EC2 / DigitalOcean / Ubuntu Server)

This guide walks you through deploying the TempMail SaaS platform on an Ubuntu server with Nginx, Docker Compose, and Let's Encrypt SSL.

---

## 1. Server Prerequisites

1. Ubuntu 22.04 LTS Instance (Minimum 2GB RAM / 1 vCPU).
2. Open Firewall Ports:
   - `22` (SSH)
   - `80` (HTTP)
   - `443` (HTTPS)
   - `25` (SMTP Ingestion)

> **IMPORTANT**: Most cloud providers (AWS EC2, DigitalOcean, Vultr) block SMTP Port 25 by default. Contact cloud support or request unblocking for inbound Port 25 traffic.

---

## 2. Install Docker & Docker Compose

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git
sudo systemctl enable docker
```

---

## 3. Clone Repository & Setup Environment

```bash
git clone https://github.com/your-org/tempmail.git /var/www/tempmail
cd /var/www/tempmail/server

cp .env.example .env
nano .env
```

Ensure environment variables reflect your live production domain:
```env
PORT=5000
SMTP_PORT=25
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=YOUR_SUPER_LONG_CRYPTO_RANDOM_SECRET
```

---

## 4. Run Containers

```bash
cd /var/www/tempmail
docker-compose up -d --build
```

---

## 5. Setup Let's Encrypt SSL (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com
```
