const User = require('../models/User');
const Transaction = require('../models/Transaction');
const logger = require('./logger');

// Credit costs for different operations
const CREDIT_COSTS = {
  SLIDE_GENERATION: 10,
  AI_RESEARCH: 5,
  SLIDE_CUSTOMIZATION: 15,
  EXPORT_PDF: 20,
  EXPORT_PPTX: 30,
  DOCUMENT_PROCESSING_PER_MB: 1,
  PREMIUM_TEMPLATE: 5,
};

// Deduct credits from user account
exports.deductCredits = async (userId, amount, type, description, metadata = {}) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.credits < amount) {
      throw new Error(`Insufficient credits. Required: ${amount}, Available: ${user.credits}`);
    }

    // Update user credits
    const creditsBefore = user.credits;
    user.credits -= amount;
    await user.save();

    // Create transaction record
    await Transaction.create({
      user: userId,
      type,
      amount: -amount,
      credits: {
        before: creditsBefore,
        after: user.credits,
        change: -amount,
      },
      balanceAfter: user.credits,
      description,
      metadata,
    });

    logger.info(`Credits deducted: ${amount} from user ${userId}. New balance: ${user.credits}`);

    return {
      success: true,
      creditsDeducted: amount,
      newBalance: user.credits,
    };
  } catch (error) {
    logger.error(`Error deducting credits: ${error.message}`);
    throw error;
  }
};

// Add credits to user account
exports.addCredits = async (userId, amount, type, description, metadata = {}) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const creditsBefore = user.credits;
    user.credits += amount;
    await user.save();

    // Create transaction record
    await Transaction.create({
      user: userId,
      type,
      amount: amount,
      credits: {
        before: creditsBefore,
        after: user.credits,
        change: amount,
      },
      balanceAfter: user.credits,
      description,
      metadata,
    });

    logger.info(`Credits added: ${amount} to user ${userId}. New balance: ${user.credits}`);

    return {
      success: true,
      creditsAdded: amount,
      newBalance: user.credits,
    };
  } catch (error) {
    logger.error(`Error adding credits: ${error.message}`);
    throw error;
  }
};

// Calculate document processing cost
exports.calculateDocumentProcessingCost = (fileSizeInBytes) => {
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
  return Math.ceil(fileSizeInMB * CREDIT_COSTS.DOCUMENT_PROCESSING_PER_MB);
};

// Calculate slide generation cost
exports.calculateSlideGenerationCost = (slideCount, withResearch = false, premiumTemplate = false) => {
  let cost = slideCount * CREDIT_COSTS.SLIDE_GENERATION;
  
  if (withResearch) {
    cost += slideCount * CREDIT_COSTS.AI_RESEARCH;
  }
  
  if (premiumTemplate) {
    cost += slideCount * CREDIT_COSTS.PREMIUM_TEMPLATE;
  }
  
  return cost;
};

// Calculate export cost
exports.calculateExportCost = (format) => {
  switch (format.toLowerCase()) {
    case 'pdf':
      return CREDIT_COSTS.EXPORT_PDF;
    case 'pptx':
      return CREDIT_COSTS.EXPORT_PPTX;
    default:
      return 0;
  }
};

// Check if user has enough credits
exports.hasEnoughCredits = async (userId, requiredAmount) => {
  try {
    const user = await User.findById(userId);
    return user && user.credits >= requiredAmount;
  } catch (error) {
    logger.error(`Error checking credits: ${error.message}`);
    return false;
  }
};

// Get user credit balance
exports.getCreditBalance = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? user.credits : 0;
  } catch (error) {
    logger.error(`Error getting credit balance: ${error.message}`);
    return 0;
  }
};

// Get credit costs
exports.getCreditCosts = () => {
  return CREDIT_COSTS;
};

module.exports.CREDIT_COSTS = CREDIT_COSTS;
