const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired',
      });
    }
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user has active subscription
exports.requireActiveSubscription = async (req, res, next) => {
  try {
    if (!req.user.hasActiveSubscription()) {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required. Please upgrade your plan.',
        subscriptionStatus: req.user.subscription.status,
        subscriptionPlan: req.user.subscription.plan,
      });
    }
    next();
  } catch (error) {
    logger.error(`Subscription check error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Check if user has enough credits
exports.requireCredits = (minimumCredits) => {
  return async (req, res, next) => {
    try {
      if (req.user.credits < minimumCredits) {
        return res.status(403).json({
          success: false,
          message: `Insufficient credits. Required: ${minimumCredits}, Available: ${req.user.credits}`,
          creditsRequired: minimumCredits,
          creditsAvailable: req.user.credits,
        });
      }
      next();
    } catch (error) {
      logger.error(`Credits check error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token invalid but continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
