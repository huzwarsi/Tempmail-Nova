/**
 * LOCAL TEST EMAIL SCRIPT
 *
 * Simulates exactly what Haraka does in production:
 * Posts a raw MIME email to Express /smtp/incoming endpoint.
 *
 * Usage:
 *   node test-email.js <inbox_address>
 *   node test-email.js tmp_abc123@tmpbox.dev
 */

const http = require('http');
const crypto = require('crypto');

const TARGET_ADDRESS = process.argv[2] || 'tmp_test@tmpbox.dev';
const EXPRESS_PORT = process.env.PORT || 5001;
const INTERNAL_SECRET = process.env.SMTP_INTERNAL_SECRET || 'haraka_internal_tempmail_secret';

const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

// Build a raw MIME email — exactly what Haraka would receive from Gmail/Yahoo
const rawEmail = [
  `Message-ID: <${crypto.randomBytes(12).toString('hex')}@test-sender.com>`,
  `Date: ${new Date().toUTCString()}`,
  `From: "Instagram" <security@mail.instagram.com>`,
  `To: ${TARGET_ADDRESS}`,
  `Subject: Your Instagram verification code is ${otpCode}`,
  `MIME-Version: 1.0`,
  `Content-Type: multipart/alternative; boundary="==BOUNDARY_001=="`,
  ``,
  `--==BOUNDARY_001==`,
  `Content-Type: text/plain; charset=UTF-8`,
  ``,
  `Your Instagram verification code is:`,
  `${otpCode}`,
  ``,
  `Bhai! Yeh ek real email hai jo SMTP pipeline ke through aayi hai.`,
  `Sender: test@gmail.com`,
  `Receiver: ${TARGET_ADDRESS}`,
  `Time: ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}`,
  ``,
  `--==BOUNDARY_001==`,
  `Content-Type: text/html; charset=UTF-8`,
  ``,
  `<!DOCTYPE html>`,
  `<html>`,
  `<body style="font-family:Arial,sans-serif;background:#0B0F19;color:#fff;padding:40px;border-radius:16px;">`,
  `  <div style="background:linear-gradient(135deg,#e1306c,#f56040);padding:24px;border-radius:12px;text-align:center;margin-bottom:24px;">`,
  `    <h1 style="margin:0;font-size:28px;">Instagram Verification</h1>`,
  `  </div>`,
  `  <p style="font-size:16px;color:#d1d5db;line-height:1.8;text-align:center;">`,
  `    Please use the following code to verify your account:`,
  `  </p>`,
  `  <div style="background:#111827;border:1px solid #1F2937;border-radius:12px;padding:24px;margin:20px 0;text-align:center;">`,
  `    <h2 style="margin:0;font-size:48px;color:#ffffff;letter-spacing:8px;">${otpCode}</h2>`,
  `  </div>`,
  `  <div style="background:#111827;border:1px solid #1F2937;border-radius:10px;padding:16px;margin:20px 0;font-family:monospace;font-size:13px;">`,
  `    <p style="margin:0;color:#60a5fa;">📮 To: ${TARGET_ADDRESS}</p>`,
  `    <p style="margin:4px 0;color:#60a5fa;">📤 From: security@mail.instagram.com</p>`,
  `    <p style="margin:4px 0;color:#60a5fa;">🕐 Time: ${new Date().toLocaleString()}</p>`,
  `    <p style="margin:4px 0;color:#34d399;">🔒 Pipeline: SMTP → Express → MongoDB → Socket.io → Browser ✅</p>`,
  `  </div>`,
  `  <p style="font-size:12px;color:#6b7280;border-top:1px solid #1F2937;padding-top:12px;text-align:center;">`,
  `    TempMail.pro — Production SMTP Email Platform`,
  `  </p>`,
  `</body>`,

  `</html>`,
  ``,
  `--==BOUNDARY_001==--`,
].join('\r\n');

const rawBuffer = Buffer.from(rawEmail, 'utf8');

// Build metadata that Haraka plugin would send
const meta = JSON.stringify({
  recipients: [TARGET_ADDRESS.toLowerCase()],
  sender: 'test@gmail.com',
  remoteIP: '127.0.0.1',
  internalSecret: INTERNAL_SECRET,
});

const metaBase64 = Buffer.from(meta).toString('base64');

const options = {
  hostname: '127.0.0.1',
  port: EXPRESS_PORT,
  path: '/smtp/incoming',
  method: 'POST',
  headers: {
    'Content-Type': 'message/rfc822',
    'Content-Length': rawBuffer.length,
    'X-TempMail-Meta': metaBase64,
    'X-Internal-Secret': INTERNAL_SECRET,
  },
};

console.log(`\n📧 Simulating Haraka delivery to: ${TARGET_ADDRESS}`);
console.log(`   Posting to: http://127.0.0.1:${EXPRESS_PORT}/smtp/incoming\n`);

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log(`✅ Email delivered successfully!`);
      console.log(`   Response: ${body}`);
      console.log(`\n👀 Browser mein dekho: http://localhost:5173`);
      console.log(`   5 seconds mein inbox mein dikhega!\n`);
    } else {
      console.error(`❌ Server returned ${res.statusCode}: ${body}`);
    }
  });
});

req.on('error', (err) => {
  console.error(`❌ Failed to reach Express server: ${err.message}`);
  console.error(`   Make sure server is running: npm run dev\n`);
});

req.write(rawBuffer);
req.end();
