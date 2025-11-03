const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: ['user', 'premium', 'admin'],
      default: 'user',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshToken: String,
    credits: {
      type: Number,
      default: 50, // Free trial credits
    },
    subscription: {
      plan: {
        type: String,
        enum: ['trial', 'starter', 'professional', 'enterprise'],
        default: 'trial',
      },
      status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'trialing'],
        default: 'trialing',
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
        default: function () {
          // 7 days trial
          return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        },
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
    },
    usage: {
      slidesGenerated: {
        type: Number,
        default: 0,
      },
      presentationsCreated: {
        type: Number,
        default: 0,
      },
      exportsUsed: {
        type: Number,
        default: 0,
      },
      lastResetDate: {
        type: Date,
        default: Date.now,
      },
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      defaultTemplate: {
        type: String,
        default: 'professional',
      },
    },
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if trial expired
userSchema.methods.isTrialExpired = function () {
  if (this.subscription.plan !== 'trial') return false;
  return new Date() > this.subscription.endDate;
};

// Check if subscription active
userSchema.methods.hasActiveSubscription = function () {
  return (
    this.subscription.status === 'active' ||
    (this.subscription.status === 'trialing' && !this.isTrialExpired())
  );
};

// Virtual for presentations
userSchema.virtual('presentations', {
  ref: 'Presentation',
  localField: '_id',
  foreignField: 'user',
});

module.exports = mongoose.model('User', userSchema);
