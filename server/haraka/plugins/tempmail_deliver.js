/**
 * Haraka Plugin: tempmail_deliver
 *
 * Bridge: External Mail Server → Haraka (port 25) → Express API POST /smtp/incoming
 */

'use strict';

var http = require('http');
var https = require('https');

// Configuration — in Docker network, Express API is accessible at host 'server'
var EXPRESS_API_HOST = process.env.EXPRESS_HOST || 'server';
var EXPRESS_API_PORT = parseInt(process.env.EXPRESS_PORT || '5001', 10);
var EXPRESS_API_PATH = '/smtp/incoming';
var USE_HTTPS = process.env.SMTP_BRIDGE_HTTPS === 'true';
var INTERNAL_SECRET = process.env.SMTP_INTERNAL_SECRET || 'haraka_internal_tempmail_secret';

exports.register = function () {
  this.loginfo('TempMail Deliver Plugin: Registered (Targeting ' + EXPRESS_API_HOST + ':' + EXPRESS_API_PORT + ')');
};

exports.hook_rcpt = function (next, connection, params) {
  var rcptObj = params && params[0];
  var rcptAddr = rcptObj ? (typeof rcptObj.address === 'function' ? rcptObj.address() : (rcptObj.address || String(rcptObj))) : 'unknown';
  this.loginfo('Accepting recipient: ' + rcptAddr);
  return next(OK);
};

exports.hook_queue = function (next, connection) {
  var plugin = this;
  var transaction = connection.transaction;

  if (!transaction) {
    plugin.logerror('No transaction found on connection');
    return next(DENYSOFT, 'Internal error: no transaction');
  }

  // ── STEP 1: Capture ALL transaction data BEFORE any async callback ──
  var recipients = [];
  try {
    var rcptList = transaction.rcpt_to || [];
    for (var i = 0; i < rcptList.length; i++) {
      var rcpt = rcptList[i];
      if (typeof rcpt.address === 'function') {
        recipients.push(rcpt.address().toLowerCase());
      } else if (rcpt.address) {
        recipients.push(String(rcpt.address).toLowerCase());
      } else {
        recipients.push(String(rcpt).replace(/[<>]/g, '').toLowerCase());
      }
    }
  } catch (e) {
    plugin.logwarn('Error extracting recipients: ' + e.message);
  }

  var senderAddress = 'unknown@sender.com';
  try {
    var mf = transaction.mail_from;
    if (mf) {
      if (typeof mf.address === 'function') {
        senderAddress = mf.address().toLowerCase();
      } else if (typeof mf.original === 'string') {
        senderAddress = mf.original.replace(/[<>]/g, '').toLowerCase();
      } else if (mf.user && mf.host) {
        senderAddress = (mf.user + '@' + mf.host).toLowerCase();
      } else {
        senderAddress = String(mf).replace(/[<>]/g, '').toLowerCase();
      }
    }
  } catch (e) {
    plugin.logwarn('Could not extract sender: ' + e.message);
  }

  var remoteIP = '0.0.0.0';
  try { remoteIP = connection.remote.ip; } catch (e) { /* ignore */ }

  plugin.loginfo('Processing: sender=' + senderAddress + ' recipients=' + recipients.join(','));

  // Pre-build metadata JSON + base64 (all synchronous, no transaction access needed later)
  var metaJSON = JSON.stringify({
    recipients: recipients,
    sender: senderAddress,
    remoteIP: remoteIP,
    internalSecret: INTERNAL_SECRET,
  });
  var metaBase64 = Buffer.from(metaJSON).toString('base64');

  // ── STEP 2: Read raw email body using Haraka's pipe API ──
  var chunks = [];
  var writable = new (require('stream').Writable)({
    write: function (chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });

  writable.on('finish', function () {
    var rawEmail = Buffer.concat(chunks);

    plugin.loginfo('Got ' + rawEmail.length + ' bytes, delivering to Express API...');

    if (rawEmail.length === 0) {
      plugin.logerror('Empty email body received');
      return next(DENYSOFT, 'Empty email');
    }

    // ── STEP 3: POST raw email to Express API ──
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
      res.on('data', function (chunk) { responseBody += chunk; });
      res.on('end', function () {
        if (res.statusCode === 200 || res.statusCode === 201) {
          plugin.loginfo('✅ Email delivered for: ' + recipients.join(', '));
          return next(OK);
        } else {
          plugin.logerror('Express API HTTP ' + res.statusCode + ': ' + responseBody);
          return next(DENYSOFT, 'Delivery service error');
        }
      });
    });

    req.on('timeout', function () {
      plugin.logerror('Express API timeout');
      req.destroy();
      return next(DENYSOFT, 'Delivery timeout');
    });

    req.on('error', function (err) {
      plugin.logerror('Express API error: ' + err.message);
      return next(DENYSOFT, 'Delivery unreachable');
    });

    req.write(rawEmail);
    req.end();
  });

  writable.on('error', function (err) {
    plugin.logerror('Stream pipe error: ' + err.message);
    return next(DENYSOFT, 'Stream error');
  });

  // Pipe Haraka's message_stream into our writable to collect the raw email
  transaction.message_stream.pipe(writable);
};
