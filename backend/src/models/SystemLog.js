const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['error', 'warn', 'info', 'debug'],
      required: true,
      index: true,
    },
    service: {
      type: String,
      required: true,
      enum: [
        'auth',
        'presentation',
        'slide-generation',
        'document-processing',
        'export',
        'payment',
        'email',
        'admin',
        'api',
        'job-queue',
      ],
      index: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    stackTrace: {
      type: String,
      maxlength: 10000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    requestInfo: {
      method: String,
      url: String,
      ip: String,
      userAgent: String,
      statusCode: Number,
      responseTime: Number,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
systemLogSchema.index({ level: 1, createdAt: -1 });
systemLogSchema.index({ service: 1, createdAt: -1 });
systemLogSchema.index({ user: 1, createdAt: -1 });
systemLogSchema.index({ resolved: 1 });

// TTL index - auto-delete logs older than 90 days
systemLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('SystemLog', systemLogSchema);
