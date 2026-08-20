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

// Configuration — in Docker network, Express API is accessible at host 'server'
const EXPRESS_API_HOST = process.env.EXPRESS_HOST || 'server';
const EXPRESS_API_PORT = parseInt(process.env.EXPRESS_PORT || '5001', 10);
const EXPRESS_API_PATH = '/smtp/incoming';
const USE_HTTPS = process.env.SMTP_BRIDGE_HTTPS === 'true';
const INTERNAL_SECRET = process.env.SMTP_INTERNAL_SECRET || 'haraka_internal_tempmail_secret';

exports.register = function () {
  this.loginfo(`TempMail Deliver Plugin: Registered (Targeting ${EXPRESS_API_HOST}:${EXPRESS_API_PORT})`);
};

exports.hook_rcpt = function (next, connection, params) {
  const rcptObj = params && params[0];
  const rcptAddr = rcptObj ? (typeof rcptObj.address === 'function' ? rcptObj.address() : (rcptObj.address || String(rcptObj))) : 'unknown';
  this.loginfo(`Accepting recipient: ${rcptAddr}`);
  return next(OK);
};

exports.hook_queue = function (next, connection) {
  const plugin = this;
  const transaction = connection.transaction;

  if (!transaction) {
    plugin.logerror('No transaction found on connection');
    return next(DENYSOFT, 'Internal error: no transaction');
  }

  // Use Haraka's built-in get_data to reliably retrieve the raw email Buffer
  transaction.message_stream.get_data((buffer) => {
    const rawEmail = buffer || Buffer.from('');

    if (rawEmail.length === 0) {
      plugin.logerror('Received empty raw email buffer');
      return next(DENYSOFT, 'Empty email message');
    }

    // Build recipient list safely
    const recipients = (transaction.rcpt_to || []).map((rcpt) => {
      const addr = typeof rcpt.address === 'function' ? rcpt.address() : (rcpt.address || String(rcpt));
      return String(addr).toLowerCase();
    });

    const sender = transaction.mail_from ? transaction.mail_from.address().toLowerCase() : 'unknown@sender.com';

    // Build metadata object to send alongside the raw email
    const meta = JSON.stringify({
      recipients,
      sender,
      remoteIP: connection.remote ? connection.remote.ip : '0.0.0.0',
      internalSecret: INTERNAL_SECRET,
    });

    const metaBase64 = Buffer.from(meta).toString('base64');

    plugin.loginfo(`Delivering email to Express API (${EXPRESS_API_HOST}:${EXPRESS_API_PORT}${EXPRESS_API_PATH}) for: ${recipients.join(', ')}`);

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
      timeout: 10000,
    };

    const protocol = USE_HTTPS ? https : http;

    const req = protocol.request(requestOptions, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          plugin.loginfo(`✅ Email successfully delivered to Express API for: ${recipients.join(', ')}`);
          return next(OK);
        } else {
          plugin.logerror(`Express API returned HTTP ${res.statusCode}: ${responseBody}`);
          return next(DENYSOFT, 'Delivery service temporarily unavailable');
        }
      });
    });

    req.on('timeout', () => {
      plugin.logerror(`Express API request timed out (${EXPRESS_API_HOST}:${EXPRESS_API_PORT})`);
      req.destroy();
      return next(DENYSOFT, 'Delivery timeout');
    });

    req.on('error', (err) => {
      plugin.logerror(`Failed to reach Express API (${EXPRESS_API_HOST}:${EXPRESS_API_PORT}): ${err.message}`);
      return next(DENYSOFT, 'Delivery service unreachable');
    });

    req.write(rawEmail);
    req.end();
  });
};
