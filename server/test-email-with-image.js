/**
 * TEST EMAIL SCRIPT WITH IMAGE ATTACHMENT
 *
 * Sends a simulated MIME email containing an attached image to target inbox.
 * Usage: node test-email-with-image.js tmp_jbu1yr0x@tmpbox.dev
 */

const http = require('http');
const crypto = require('crypto');

const TARGET_ADDRESS = process.argv[2] || 'tmp_jbu1yr0x@tmpbox.dev';
const EXPRESS_PORT = process.env.PORT || 5001;
const INTERNAL_SECRET = process.env.SMTP_INTERNAL_SECRET || 'haraka_internal_tempmail_secret';

// A tiny valid 1x1 green PNG image base64 encoded
const base64Png = 'iVBORw0KGgoAAAANSU5EUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const imageBuffer = Buffer.from(base64Png, 'base64');

const boundary = '==MIXED_BOUNDARY_001==';
const altBoundary = '==ALT_BOUNDARY_001==';

const rawEmailParts = [
  `Message-ID: <${crypto.randomBytes(12).toString('hex')}@test-sender.com>`,
  `Date: ${new Date().toUTCString()}`,
  `From: "TempMail Security Desk" <security@tempmailnova.com>`,
  `To: ${TARGET_ADDRESS}`,
  `Subject: 🖼️ Image Attachment Test Email`,
  `MIME-Version: 1.0`,
  `Content-Type: multipart/mixed; boundary="${boundary}"`,
  ``,
  `--${boundary}`,
  `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
  ``,
  `--${altBoundary}`,
  `Content-Type: text/plain; charset=UTF-8`,
  ``,
  `Bhai! Yeh email image attachment ke saath bheji gayi hai.`,
  `Target: ${TARGET_ADDRESS}`,
  ``,
  `--${altBoundary}`,
  `Content-Type: text/html; charset=UTF-8`,
  ``,
  `<!DOCTYPE html>`,
  `<html>`,
  `<body style="font-family:Arial,sans-serif;background:#080d16;color:#ffffff;padding:30px;border-radius:16px;">`,
  `  <div style="background:#108954;padding:16px;border-radius:12px;text-align:center;margin-bottom:20px;">`,
  `    <h2 style="margin:0;color:#ffffff;">📷 Image Attachment Test Delivered</h2>`,
  `  </div>`,
  `  <p style="font-size:15px;color:#cbd5e1;line-height:1.6;">`,
  `    Assalam-o-Alaikum Bhai! Yeh live test email aap ke temporary mailbox <strong>${TARGET_ADDRESS}</strong> par bheji gayi hai.`,
  `  </p>`,
  `  <p style="font-size:14px;color:#94a3b8;">`,
  `    Is email mein 1 attachment image (<code>test_image.png</code>) include ki gayi hai. Node.js Express backend ne real-time MIME parser se image ko process karke MongoDB mein save kar liya hai!`,
  `  </p>`,
  `</body>`,
  `</html>`,
  ``,
  `--${altBoundary}--`,
  ``,
  `--${boundary}`,
  `Content-Type: image/png`,
  `Content-Transfer-Encoding: base64`,
  `Content-Disposition: attachment; filename="test_image.png"`,
  ``,
  base64Png,
  ``,
  `--${boundary}--`,
];

const rawEmail = rawEmailParts.join('\r\n');
const rawBuffer = Buffer.from(rawEmail, 'utf8');

const meta = JSON.stringify({
  recipients: [TARGET_ADDRESS.toLowerCase()],
  sender: 'security@tempmailnova.com',
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

console.log(`\n📧 Sending test image email to: ${TARGET_ADDRESS}`);

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log(`✅ SUCCESS: Image email successfully delivered to ${TARGET_ADDRESS}!`);
      console.log(`   Response: ${body}\n`);
    } else {
      console.error(`❌ FAILED (${res.statusCode}): ${body}`);
    }
  });
});

req.on('error', (err) => {
  console.error(`❌ Request error: ${err.message}`);
});

req.write(rawBuffer);
req.end();
