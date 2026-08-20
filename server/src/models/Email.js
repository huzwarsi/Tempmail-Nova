const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema(
  {
    inboxAddress: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    sender: {
      address: { type: String, required: true },
      name: { type: String, default: '' },
    },
    recipients: [
      {
        address: { type: String, required: true },
        name: { type: String, default: '' },
      },
    ],
    subject: {
      type: String,
      default: '(No Subject)',
      trim: true,
    },
    bodyText: {
      type: String,
      default: '',
    },
    bodyHtml: {
      type: String,
      default: '',
    },
    rawHeaders: {
      type: String,
      default: '',
    },
    attachments: [
      {
        filename: String,
        contentType: String,
        size: Number,
        contentId: String,
        attachmentId: String,
      },
    ],
    messageId: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
    spamScore: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatic TTL cleanup
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Email', emailSchema);
