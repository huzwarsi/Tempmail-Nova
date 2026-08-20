/**
 * TempMail Production Server
 *
 * Architecture:
 *   Haraka (port 25/2525) → POST /smtp/incoming → this Express server
 *   React Client          → /api/v1/...          → this Express server
 *   Socket.io             → /socket.io            → real-time push
 *
 * Haraka handles all raw SMTP MX intake.
 * Express handles API, email storage, and WebSocket broadcasting.
 */

const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();

const connectDB = require('./config/db');
const { initSocket } = require('./services/socketService');
const { initCleanupQueue } = require('./services/bullQueue');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const inboxRoutes = require('./routes/inboxRoutes');
const emailRoutes = require('./routes/emailRoutes');
const domainRoutes = require('./routes/domainRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiV1Routes = require('./routes/apiV1Routes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const smtpRoutes = require('./routes/smtpRoutes'); // ← Haraka bridge

const app = express();

// Trust proxy — required when running behind Nginx/Cloudflare/etc.
app.set('trust proxy', 1);

const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io (real-time email push)
initSocket(server);

// Initialize BullMQ Background Cleanup Worker
initCleanupQueue();

// ── Security & Optimization Middleware ───────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(compression());

// NOTE: The /smtp/incoming route uses express.raw() — must be registered BEFORE express.json()
app.use('/smtp', smtpRoutes);

// Now apply json parser for all other routes
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(mongoSanitize());
app.use(xss());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Public API Endpoints ──────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/inbox', inboxRoutes);
app.use('/api/v1/email', emailRoutes);
app.use('/api/v1/domain', domainRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/v1', apiV1Routes);
app.use('/api/v1/analytics', analyticsRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    service: 'TempMail SMTP + API Server',
    environment: process.env.NODE_ENV || 'development',
    smtpBridge: 'Haraka → /smtp/incoming',
  });
});

// ── Central Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start HTTP Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`\n🚀 TempMail Server Started`);
  console.log(`   HTTP API   → http://localhost:${PORT}`);
  console.log(`   SMTP Bridge → POST /smtp/incoming (Haraka → here)`);
  console.log(`   Socket.io  → ws://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Kill it: npx kill-port ${PORT}\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

module.exports = { app, server };
