# TempMail.pro - Production SaaS Disposable Email Platform

[![Tech Stack](https://img.shields.io/badge/Stack-React_19_|_Express_|_MongoDB_|_Redis_|_Socket.io-blue.svg)](https://github.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-emerald.svg)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A complete, high-performance, real-time Disposable Email SaaS platform built with the MERN stack, Socket.io, BullMQ, and embedded Node.js SMTP ingestion. Competes directly with Temp-Mail.org, Mail.tm, and Guerrilla Mail.

---

## 🌟 Key Features

- **Real-Time SMTP Email Intake**: Built-in `smtp-server` receiving real external emails on SMTP Port 25/2525.
- **WebSocket Streaming**: Instant email notifications broadcasted over Socket.io to client browsers.
- **HTML & MIME Parser**: Full HTML rendering, CID inline images, plain text tabs, and binary attachment downloader.
- **Auto-Expiration & Purge**: Automated BullMQ background workers deleting expired inboxes and emails after 24 hours.
- **Custom Email Aliases & Multiple Domains**: Allows users to select custom domain names or create specific prefixes.
- **Developer REST API**: Secure API keys with rate limiting for test automation suites.
- **AdSense & Monetization Ready**: Pre-built AdSense banner slots (Header, Sidebar) and Stripe subscription support.
- **Admin Dashboard**: Statistics counters, domain manager, user manager, and security audit logs.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Axios, React Query, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Redis, BullMQ, Socket.io, `smtp-server`, `mailparser`.
- **Infrastructure**: Docker, Docker Compose, Nginx, PM2, Let's Encrypt SSL.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js >= 18
- MongoDB instance (local or MongoDB Atlas)
- Redis server (local or Docker)

### 1. Clone & Install Dependencies
```bash
# Server Setup
cd server
npm install
cp .env.example .env

# Client Setup
cd ../client
npm install
```

### 2. Start Backend & Frontend
```bash
# Terminal 1: Backend Server (HTTP + SMTP Receiver)
cd server
npm run dev

# Terminal 2: Frontend Client
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🐳 Docker Production Deployment

```bash
docker-compose up -d --build
```

---

## 📄 Documentation

- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [DNS (MX, SPF, DKIM, DMARC) Setup](docs/DNS_AND_EMAIL_SETUP.md)
