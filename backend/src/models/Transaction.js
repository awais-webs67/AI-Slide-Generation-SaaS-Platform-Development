const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'credit_purchase',
        'credit_grant',
        'slide_generation',
        'slide_customization',
        'export_pdf',
        'export_pptx',
        'document_processing',
        'subscription_payment',
        'refund',
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    credits: {
      before: Number,
      after: Number,
      change: Number,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    relatedPresentation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Presentation',
    },
    relatedSlide: {
      type: Number,
    },
    paymentDetails: {
      stripePaymentId: String,
      stripeInvoiceId: String,
      currency: {
        type: String,
        default: 'usd',
      },
      amountPaid: Number,
      status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'refunded'],
      },
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ 'paymentDetails.stripePaymentId': 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
