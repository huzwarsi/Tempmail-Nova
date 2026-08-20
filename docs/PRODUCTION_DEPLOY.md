# Complete Production Deployment Guide
## TempMail — Real Email Receiving on Ubuntu VPS

---

## Prerequisites Checklist

- [ ] Ubuntu 22.04 LTS VPS (min 1GB RAM — DigitalOcean $4/mo or Contabo $5/mo)
- [ ] A real domain name (e.g. `fastinbox.site`) — ~$1-5/year on Namecheap
- [ ] Domain DNS control (Namecheap dashboard, Cloudflare, etc.)
- [ ] VPS public IP address (e.g. `134.209.x.x`)

---

## Step 1: Point Your Domain to the VPS

In your domain registrar's DNS panel, create these records:

```
Type    Name    Value                   TTL
────────────────────────────────────────────
A       @       YOUR_VPS_IP             3600
A       www     YOUR_VPS_IP             3600
A       mail    YOUR_VPS_IP             3600
MX      @       mail.yourdomain.com     3600   (Priority: 10)
TXT     @       v=spf1 mx ip4:YOUR_VPS_IP ~all  3600
```

> ⚠️ DNS propagation takes 10 minutes to 2 hours. Use https://dnschecker.org to verify.

---

## Step 2: Verify MX Record Is Resolving

```bash
# From any terminal (your local PC is fine):
nslookup -type=MX yourdomain.com

# Expected output:
# yourdomain.com  mail exchanger = 10 mail.yourdomain.com
# mail.yourdomain.com = YOUR_VPS_IP
```

---

## Step 3: Run Setup Script on VPS

SSH into your VPS and run the one-command setup:

```bash
ssh root@YOUR_VPS_IP

# Install everything (Docker, firewall, SSL):
curl -fsSL https://raw.githubusercontent.com/yourrepo/tempmail/main/scripts/setup-vps.sh | bash -s -- yourdomain.com your@email.com
```

This installs:
- Docker & Docker Compose
- Certbot (Let's Encrypt SSL)
- UFW firewall (opens ports 22, 25, 80, 443)

---

## Step 4: Upload Project to VPS

```bash
# From your local Windows machine:
# Option A: SCP
scp -r "D:/Temp Mail/" root@YOUR_VPS_IP:/var/www/tempmail

# Option B: Git
git init && git add . && git commit -m "deploy"
git remote add vps root@YOUR_VPS_IP:/var/www/tempmail.git
git push vps main
```

---

## Step 5: Configure Production Environment

```bash
ssh root@YOUR_VPS_IP
cd /var/www/tempmail/server

# Copy production template and fill in your values:
cp .env.production .env
nano .env
```

Fill in:
```env
DEFAULT_DOMAIN=yourdomain.com
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=<run: openssl rand -hex 48>
SMTP_INTERNAL_SECRET=<run: openssl rand -hex 32>
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourStrongPassword123!
```

---

## Step 6: Update Haraka Config with Your Domain

```bash
nano /var/www/tempmail/server/haraka/config/smtp.ini
# Change:
#   smtp_greeting_host=mail.yourdomain.com
```

---

## Step 7: Deploy with Docker Compose

```bash
cd /var/www/tempmail

# Build and start all containers:
docker compose -f docker-compose.prod.yml up -d --build

# Check all containers are running:
docker compose -f docker-compose.prod.yml ps

# Expected output:
# tempmail-haraka   → Up (port 25)
# tempmail-server   → Up (port 5001, internal)
# tempmail-client   → Up (ports 80, 443)
# tempmail-mongo    → Up (internal)
# tempmail-redis    → Up (internal)
```

---

## Step 8: Seed Initial Database

```bash
docker exec tempmail-server node scripts/seed.js

# Expected:
# ✅ Domain seeded: @yourdomain.com
# ✅ Admin user created: admin@yourdomain.com
# 🎉 Database seeding complete!
```

---

## Step 9: Test Real Email Receiving

```bash
# Send a test email TO your disposable address FROM any email client:
# To: test@yourdomain.com

# OR test via SMTP telnet:
telnet mail.yourdomain.com 25
> HELO gmail.com
> MAIL FROM:<sender@gmail.com>
> RCPT TO:<test@yourdomain.com>
> DATA
> Subject: Real Test Email!
> This is a real email test.
> .
> QUIT
```

Then open `https://yourdomain.com` → enter `test@yourdomain.com` → email appears instantly!

---

## Step 10: Verify DKIM (Optional but Recommended)

DKIM improves deliverability and prevents your domain from being blacklisted:

```bash
# Generate DKIM keys:
docker exec tempmail-haraka haraka-mk-dkim yourdomain.com

# Add the TXT record output to your DNS:
# Type: TXT
# Name: mail._domainkey
# Value: v=DKIM1; k=rsa; p=<your-public-key>
```

---

## Monitoring & Logs

```bash
# Real-time Haraka SMTP logs (incoming email activity):
docker logs -f tempmail-haraka

# Express API logs:
docker logs -f tempmail-server

# Mongo logs:
docker logs -f tempmail-mongo
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Port 25 blocked | Cloud provider policy | Contact support to unblock port 25 (AWS requires form submission) |
| No emails arriving | MX not propagated | Wait 1-2 hours, verify with dnschecker.org |
| SSL error | Cert not obtained | Run `certbot certonly --standalone -d yourdomain.com` manually |
| EADDRINUSE | Port conflict | `docker compose down && docker compose up -d` |

---

## Architecture Flow (Visual)

```
Gmail User types: test@yourdomain.com
         ↓
Gmail SMTP → DNS MX lookup for yourdomain.com
         ↓
MX Record returns: mail.yourdomain.com → YOUR_VPS_IP
         ↓
Connection to YOUR_VPS_IP:25
         ↓
Haraka SMTP Server (container: tempmail-haraka)
  → validates recipient domain
  → streams raw MIME email to tempmail_deliver plugin
         ↓
HTTP POST to http://server:5001/smtp/incoming (internal Docker network)
         ↓
Express smtpController.js:
  → mailparser: parses HTML, text, attachments
  → spamFilter: scores for spam
  → MongoDB Atlas: saves email + attachments
  → auto-creates inbox if not exists
         ↓
Socket.io emitNewEmail()
         ↓
Browser at https://yourdomain.com:
  → socket event "email_received"
  → Email appears in inbox INSTANTLY ✅
```
