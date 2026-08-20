const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      unique: true,
      index: true,
    },
    emailsReceived: {
      type: Number,
      default: 0,
    },
    inboxesCreated: {
      type: Number,
      default: 0,
    },
    activeInboxes: {
      type: Number,
      default: 0,
    },
    spamBlocked: {
      type: Number,
      default: 0,
    },
    attachmentsProcessed: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    apiRequestsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
