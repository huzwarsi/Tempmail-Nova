const mongoose = require('mongoose');

const anonymousUserSchema = new mongoose.Schema(
  {
    fingerprint: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    activeInboxesCount: {
      type: Number,
      default: 0,
    },
    totalCreated: {
      type: Number,
      default: 0,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AnonymousUser', anonymousUserSchema);
