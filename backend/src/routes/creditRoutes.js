const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get credit balance
router.get('/balance', (req, res) => {
  res.json({
    success: true,
    data: {
      credits: req.user.credits,
      subscription: req.user.subscription,
    },
  });
});

// Get credit transaction history
router.get('/transactions', (req, res) => {
  res.json({ success: true, message: 'Get transactions - TODO' });
});

// Get credit costs
router.get('/costs', (req, res) => {
  const { CREDIT_COSTS } = require('../utils/creditSystem');
  res.json({
    success: true,
    data: CREDIT_COSTS,
  });
});

module.exports = router;
