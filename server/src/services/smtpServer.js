const { SMTPServer } = require('smtp-server');
const { parseAndSaveIncomingEmail } = require('./mailParserService');
const Domain = require('../models/Domain');

let smtpServerInstance = null;

const startSMTPServer = (port = process.env.SMTP_PORT || 2525) => {
  smtpServerInstance = new SMTPServer({
    secure: false,
    authOptional: true, // Allow receiving anonymous emails from outer world (MX receiver pattern)
    disabledCommands: ['AUTH'], // No auth needed for incoming MX mail intake
    name: 'tempmail-mx-receiver',

    // Validate recipient address against active database domains
    onRcptTo(address, session, callback) {
      const recipient = address.address.toLowerCase().trim();
      const domainParts = recipient.split('@');

      if (domainParts.length !== 2) {
        return callback(new Error('Invalid email recipient format'));
      }

      const domainName = domainParts[1];

      // In production/dev, verify domain exists or allow all if wild-card configured
      Domain.findOne({ name: domainName, isActive: true })
        .then((foundDomain) => {
          if (!foundDomain && process.env.NODE_ENV === 'production') {
            console.warn(`[SMTP Server] Rejected email for unconfigured domain: ${domainName}`);
            return callback(new Error('550 Domain not served by this MX cluster'));
          }
          return callback(); // Accept recipient
        })
        .catch(() => callback()); // Default allow in dev fallback
    },

    // Handle incoming email message stream
    onData(stream, session, callback) {
      console.log(`[SMTP Server] Incoming mail connection from: ${session.remoteAddress}`);

      parseAndSaveIncomingEmail(stream)
        .then(() => {
          console.log('[SMTP Server] Message parsed and stored successfully.');
          return callback(); // 250 OK
        })
        .catch((err) => {
          console.error('[SMTP Server Processing Error]:', err.message);
          return callback(new Error('451 Local error in processing mail'));
        });
    },
  });

  smtpServerInstance.on('error', (err) => {
    console.error('[SMTP Server Runtime Error]:', err.message);
  });

  smtpServerInstance.listen(port, () => {
    console.log(`[SMTP Server Running]: Listening for incoming MX emails on port ${port}`);
  });

  return smtpServerInstance;
};

module.exports = {
  startSMTPServer,
};
