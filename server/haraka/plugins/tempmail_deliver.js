/**
 * Haraka Plugin: tempmail_deliver
 *
 * This is the core bridge between Haraka SMTP receiver and the TempMail Express API.
 *
 * Flow:
 *   External Mail Server → Haraka (port 25) → This Plugin → Express API POST /smtp/incoming
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

  // IMPORTANT: Capture all transaction data BEFORE get_data callback
  // Inside get_data callback, transaction context may be partially invalidated
  const recipients = (transaction.rcpt_to || []).map(function (rcpt) {
    if (typeof rcpt.address === 'function') return rcpt.address().toLowerCase();
    if (rcpt.address) return String(rcpt.address).toLowerCase();
    return String(rcpt).toLowerCase();
  });

  var senderAddress = 'unknown@sender.com';
  try {
    if (transaction.mail_from) {
      if (typeof transaction.mail_from.address === 'function') {
        senderAddress = transaction.mail_from.address().toLowerCase();
      } else if (transaction.mail_from.address) {
        senderAddress = String(transaction.mail_from.address).toLowerCase();
      } else {
        senderAddress = String(transaction.mail_from).replace(/[<>]/g, '').toLowerCase();
      }
    }
  } catch (e) {
    plugin.logwarn('Could not extract sender address: ' + e.message);
  }

  var remoteIP = '0.0.0.0';
  try {
    remoteIP = connection.remote ? connection.remote.ip : '0.0.0.0';
  } catch (e) {
    // ignore
  }

  plugin.loginfo('Sender: ' + senderAddress + ' | Recipients: ' + recipients.join(', '));

  // Build metadata BEFORE get_data
  var meta = JSON.stringify({
    recipients: recipients,
    sender: senderAddress,
    remoteIP: remoteIP,
    internalSecret: INTERNAL_SECRET,
  });
  var metaBase64 = Buffer.from(meta).toString('base64');

  // Now stream the raw email body
  var chunks = [];
  var messageStream = transaction.message_stream;

  messageStream.on('data', function (chunk) {
    chunks.push(chunk);
  });

  messageStream.on('error', function (err) {
    plugin.logerror('Stream error: ' + err.message);
    return next(DENYSOFT, 'Error reading email stream');
  });

  messageStream.on('end', function () {
    var rawEmail = Buffer.concat(chunks);

    if (rawEmail.length === 0) {
      plugin.logerror('Received empty raw email buffer');
      return next(DENYSOFT, 'Empty email message');
    }

    plugin.loginfo('Delivering ' + rawEmail.length + ' bytes to Express API (' + EXPRESS_API_HOST + ':' + EXPRESS_API_PORT + ')');

    var requestOptions = {
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

    var protocol = USE_HTTPS ? https : http;

    var req = protocol.request(requestOptions, function (res) {
      var responseBody = '';

      res.on('data', function (chunk) {
        responseBody += chunk;
      });

      res.on('end', function () {
        if (res.statusCode === 200 || res.statusCode === 201) {
          plugin.loginfo('✅ Email delivered to Express API for: ' + recipients.join(', '));
          return next(OK);
        } else {
          plugin.logerror('Express API returned HTTP ' + res.statusCode + ': ' + responseBody);
          return next(DENYSOFT, 'Delivery service temporarily unavailable');
        }
      });
    });

    req.on('timeout', function () {
      plugin.logerror('Express API request timed out');
      req.destroy();
      return next(DENYSOFT, 'Delivery timeout');
    });

    req.on('error', function (err) {
      plugin.logerror('Failed to reach Express API: ' + err.message);
      return next(DENYSOFT, 'Delivery service unreachable');
    });

    req.write(rawEmail);
    req.end();
  });

  // Start reading the message stream
  messageStream.resume();
};
