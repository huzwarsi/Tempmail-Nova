/**
 * Haraka Plugin: tempmail_deliver
 *
 * This is the core bridge between Haraka SMTP receiver and the TempMail Express API.
 *
 * Flow:
 *   External Mail Server → Haraka (port 25) → This Plugin → Express API POST /smtp/incoming
 *
 * The plugin streams the raw MIME email data to the Express API,
 * which then parses it, stores it in MongoDB, and pushes it via Socket.io.
 */

'use strict';

const http = require('http');
const https = require('https');

// Configuration
const EXPRESS_API_HOST = process.env.EXPRESS_HOST || '127.0.0.1';
const EXPRESS_API_PORT = process.env.EXPRESS_PORT || 5001;
const EXPRESS_API_PATH = '/smtp/incoming';
const USE_HTTPS = process.env.SMTP_BRIDGE_HTTPS === 'true';
const INTERNAL_SECRET = process.env.SMTP_INTERNAL_SECRET || 'haraka_internal_tempmail_secret';

exports.register = function () {
  this.loginfo('TempMail Deliver Plugin: Registered and ready');
};

exports.hook_queue = function (next, connection) {
  const plugin = this;
  const transaction = connection.transaction;

  if (!transaction) {
    plugin.logerror('No transaction found on connection');
    return next(DENYSOFT, 'Internal error: no transaction');
  }

  // Collect raw email message into a buffer
  const chunks = [];
  const messageStream = transaction.message_stream;

  messageStream.on('data', (chunk) => {
    chunks.push(chunk);
  });

  messageStream.on('error', (err) => {
    plugin.logerror(`Stream error: ${err.message}`);
    return next(DENYSOFT, 'Error reading email stream');
  });

  messageStream.on('end', () => {
    const rawEmail = Buffer.concat(chunks);

    // Build recipient list
    const recipients = transaction.rcpt_to.map((rcpt) => rcpt.address().toLowerCase());

    // Build metadata object to send alongside the raw email
    const meta = JSON.stringify({
      recipients,
      sender: transaction.mail_from.address().toLowerCase(),
      remoteIP: connection.remote.ip,
      internalSecret: INTERNAL_SECRET,
    });

    const metaBase64 = Buffer.from(meta).toString('base64');

    // POST the raw email + metadata to Express API
    const requestOptions = {
      hostname: EXPRESS_API_HOST,
      port: EXPRESS_API_PORT,
      path: EXPRESS_API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'message/rfc822',
        'Content-Length': rawEmail.length,
        'X-TempMail-Meta': metaBase64,
        'X-Internal-Secret': INTERNAL_SECRET,
      },
      timeout: 15000,
    };

    const protocol = USE_HTTPS ? https : http;

    const req = protocol.request(requestOptions, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          plugin.loginfo(`Email delivered to Express API for: ${recipients.join(', ')}`);
          return next(OK);
        } else {
          plugin.logerror(`Express API returned ${res.statusCode}: ${responseBody}`);
          return next(DENYSOFT, 'Delivery service temporarily unavailable');
        }
      });
    });

    req.on('timeout', () => {
      plugin.logerror('Express API request timed out');
      req.destroy();
      return next(DENYSOFT, 'Delivery timeout');
    });

    req.on('error', (err) => {
      plugin.logerror(`Failed to reach Express API: ${err.message}`);
      return next(DENYSOFT, 'Delivery service unreachable');
    });

    req.write(rawEmail);
    req.end();
  });

  // Start reading the message stream
  messageStream.resume();
};
