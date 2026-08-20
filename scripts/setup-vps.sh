#!/bin/bash
##############################################################################
# TempMail VPS Setup Script
# Run as root on a fresh Ubuntu 22.04 server:
#   wget -O setup.sh https://raw.githubusercontent.com/yourrepo/tempmail/main/scripts/setup-vps.sh
#   chmod +x setup.sh
#   sudo ./setup.sh yourdomain.com your@email.com
##############################################################################

set -e

DOMAIN=$1
EMAIL=$2

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "Usage: ./setup-vps.sh yourdomain.com your@email.com"
  exit 1
fi

echo ""
echo "======================================================"
echo "  TempMail VPS Setup — Domain: $DOMAIN"
echo "======================================================"
echo ""

# ── 1. System Update ──────────────────────────────────────────────────────────
echo "[1/8] Updating system packages..."
apt-get update -y && apt-get upgrade -y

# ── 2. Install Docker ─────────────────────────────────────────────────────────
echo "[2/8] Installing Docker..."
apt-get install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl enable docker && systemctl start docker

# ── 3. Install Certbot for SSL ────────────────────────────────────────────────
echo "[3/8] Installing Certbot..."
apt-get install -y certbot

# ── 4. Open Firewall Ports ────────────────────────────────────────────────────
echo "[4/8] Configuring firewall..."
ufw allow 22/tcp    # SSH
ufw allow 25/tcp    # SMTP (Haraka MX receiver)
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable

# ── 5. Clone / Pull Project ───────────────────────────────────────────────────
echo "[5/8] Setting up application directory..."
mkdir -p /var/www/tempmail
cd /var/www/tempmail

# ── 6. Setup Environment Variables ───────────────────────────────────────────
echo "[6/8] Creating production .env..."
cat > /var/www/tempmail/server/.env <<EOF
PORT=5001
MONGO_URI=mongodb://mongodb:27017/tempmail
REDIS_HOST=redis
REDIS_PORT=6379
NODE_ENV=production
FRONTEND_URL=https://$DOMAIN
JWT_SECRET=$(openssl rand -hex 48)
SMTP_INTERNAL_SECRET=$(openssl rand -hex 32)
DEFAULT_DOMAIN=$DOMAIN
MAX_INBOX_EXPIRATION_HOURS=24
EOF

echo "✅ .env created at /var/www/tempmail/server/.env"

# ── 7. Get SSL Certificate ────────────────────────────────────────────────────
echo "[7/8] Obtaining SSL certificate for $DOMAIN..."
# Temporarily stop anything on port 80
certbot certonly --standalone -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos --email "$EMAIL" || {
  echo "⚠️  Certbot failed. Make sure DNS A record points to this server IP first!"
  echo "    DNS A: $DOMAIN → $(curl -s ifconfig.me)"
}

# ── 8. Update Nginx Config with Domain ───────────────────────────────────────
echo "[8/8] Updating Nginx config..."
sed -i "s/yourdomain.com/$DOMAIN/g" /var/www/tempmail/nginx/tempmail.conf

echo ""
echo "======================================================"
echo "  ✅ VPS Setup Complete!"
echo ""
echo "  Next steps:"
echo "  1. Copy your project files to /var/www/tempmail/"
echo "  2. Configure DNS records (see DNS_AND_EMAIL_SETUP.md)"
echo "  3. Run: cd /var/www/tempmail && docker compose -f docker-compose.prod.yml up -d --build"
echo "  4. Seed initial domain: docker exec tempmail-server node scripts/seed.js"
echo ""
echo "  Server IP: $(curl -s ifconfig.me)"
echo "======================================================"
