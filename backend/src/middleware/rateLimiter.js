const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = require('../config/redis');

// General API rate limiter
exports.generalLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:general:',
  }),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === 'admin';
  },
});

// Auth rate limiter (stricter for login/register)
exports.authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slide generation rate limiter
exports.generationLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:generation:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    // Different limits based on subscription
    if (!req.user) return 0;
    
    switch (req.user.subscription.plan) {
      case 'enterprise':
        return 100;
      case 'professional':
        return 50;
      case 'starter':
        return 20;
      case 'trial':
        return 5;
      default:
        return 3;
    }
  },
  message: {
    success: false,
    message: 'Generation limit reached for your subscription plan. Please upgrade or wait.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.user && req.user.role === 'admin';
  },
});

// Export rate limiter
exports.exportLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:export:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    if (!req.user) return 0;
    
    switch (req.user.subscription.plan) {
      case 'enterprise':
        return 1000;
      case 'professional':
        return 100;
      case 'starter':
        return 10;
      case 'trial':
        return 1;
      default:
        return 1;
    }
  },
  message: {
    success: false,
    message: 'Export limit reached for your subscription plan.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter
exports.uploadLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:upload:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    if (!req.user) return 0;
    
    switch (req.user.subscription.plan) {
      case 'enterprise':
        return 200;
      case 'professional':
        return 100;
      case 'starter':
        return 50;
      case 'trial':
        return 10;
      default:
        return 5;
    }
  },
  message: {
    success: false,
    message: 'Upload limit reached for your subscription plan.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
