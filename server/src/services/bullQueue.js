const { Queue, Worker } = require('bullmq');
const Inbox = require('../models/Inbox');
const Email = require('../models/Email');
const Attachment = require('../models/Attachment');

let cleanupQueue = null;

const initCleanupQueue = () => {
  const connection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  };

  try {
    cleanupQueue = new Queue('inbox-cleanup', { connection });

    // Schedule hourly recurring cleanup task
    cleanupQueue.add(
      'purge-expired-data',
      {},
      {
        repeat: { cron: '0 * * * *' }, // Every hour
      }
    );

    // Worker process
    const worker = new Worker(
      'inbox-cleanup',
      async (job) => {
        console.log(`[BullMQ Worker] Executing job: ${job.name}`);
        const now = new Date();

        // Find expired inboxes
        const expiredInboxes = await Inbox.find({ expiresAt: { $lt: now } });
        const expiredAddresses = expiredInboxes.map((i) => i.address);

        if (expiredAddresses.length > 0) {
          // Find emails for these inboxes
          const expiredEmails = await Email.find({
            $or: [{ inboxAddress: { $in: expiredAddresses } }, { expiresAt: { $lt: now } }],
          });
          const emailIds = expiredEmails.map((e) => e._id);

          // Delete attachments, emails, and inboxes
          await Attachment.deleteMany({ emailId: { $in: emailIds } });
          await Email.deleteMany({ _id: { $in: emailIds } });
          await Inbox.deleteMany({ address: { $in: expiredAddresses } });

          console.log(
            `[BullMQ Worker] Purged ${expiredInboxes.length} inboxes, ${expiredEmails.length} emails.`
          );
        }
      },
      { connection }
    );

    worker.on('completed', (job) => console.log(`[BullMQ Job Done]: ${job.id}`));
    worker.on('failed', (job, err) => console.warn(`[BullMQ Job Failed]: ${err.message}`));
  } catch (err) {
    console.warn('[BullMQ] Queue initialization deferred (Redis offline fallback active)');
  }
};

module.exports = {
  initCleanupQueue,
};
