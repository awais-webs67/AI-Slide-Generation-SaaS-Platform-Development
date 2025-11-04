const Presentation = require('../models/Presentation');
const documentService = require('../services/documentService');
const geminiService = require('../services/geminiService');
const creditSystem = require('../utils/creditSystem');
const logger = require('../utils/logger');

// @desc    Get all presentations for logged-in user
// @route   GET /api/v1/presentations
// @access  Private
exports.getAllPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-slides.code -slides.content');

    res.status(200).json({
      success: true,
      count: presentations.length,
      data: presentations,
    });
  } catch (error) {
    logger.error(`Get presentations error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch presentations',
    });
  }
};

// @desc    Get single presentation by ID
// @route   GET /api/v1/presentations/:id
// @access  Private
exports.getPresentationById = async (req, res) => {
  try {
    const presentation = await Presentation.findById(req.params.id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found',
      });
    }

    // Check ownership
    if (presentation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this presentation',
      });
    }

    res.status(200).json({
      success: true,
      data: presentation,
    });
  } catch (error) {
    logger.error(`Get presentation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch presentation',
    });
  }
};

// @desc    Create new presentation from prompt
// @route   POST /api/v1/presentations
// @access  Private
exports.createPresentation = async (req, res) => {
  try {
    const { title, sourceType, sourcePrompt, slideCount = 10 } = req.body;

    // Validate input
    if (!title || !sourceType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and source type',
      });
    }

    if (sourceType === 'prompt' && !sourcePrompt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a prompt for generation',
      });
    }

    // Calculate credits needed
    const creditsNeeded = creditSystem.calculateSlideGenerationCost(
      slideCount,
      true,
      false
    );

    // Check if user has enough credits
    if (req.user.credits < creditsNeeded) {
      return res.status(403).json({
        success: false,
        message: `Insufficient credits. Required: ${creditsNeeded}, Available: ${req.user.credits}`,
        creditsRequired: creditsNeeded,
        creditsAvailable: req.user.credits,
      });
    }

    // Create presentation record
    const presentation = await Presentation.create({
      user: req.user.id,
      title,
      sourceType,
      sourcePrompt,
      status: 'analyzing',
    });

    // Deduct credits
    await creditSystem.deductCredits(
      req.user.id,
      creditsNeeded,
      'slide_generation',
      `Generating ${slideCount} slides: ${title}`,
      { presentationId: presentation._id }
    );

    // Generate outline using Gemini
    try {
      presentation.status = 'outlining';
      await presentation.save();

      const outline = await geminiService.generateOutlineFromPrompt(
        sourcePrompt,
        slideCount
      );

      presentation.outline = outline;
      presentation.status = 'completed';
      await presentation.save();

      // Update user usage stats
      await req.user.updateOne({
        $inc: {
          'usage.presentationsCreated': 1,
          'usage.slidesGenerated': slideCount,
        },
      });

      logger.info(`Presentation created: ${presentation._id} by user ${req.user.id}`);

      res.status(201).json({
        success: true,
        message: 'Presentation created successfully',
        data: presentation,
      });
    } catch (error) {
      presentation.status = 'failed';
      await presentation.save();
      throw error;
    }
  } catch (error) {
    logger.error(`Create presentation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create presentation',
      error: error.message,
    });
  }
};

// @desc    Update presentation
// @route   PUT /api/v1/presentations/:id
// @access  Private
exports.updatePresentation = async (req, res) => {
  try {
    let presentation = await Presentation.findById(req.params.id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found',
      });
    }

    // Check ownership
    if (presentation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this presentation',
      });
    }

    // Update only allowed fields
    const { title, description } = req.body;
    if (title) presentation.title = title;
    if (description) presentation.description = description;

    await presentation.save();

    res.status(200).json({
      success: true,
      message: 'Presentation updated successfully',
      data: presentation,
    });
  } catch (error) {
    logger.error(`Update presentation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update presentation',
    });
  }
};

// @desc    Delete presentation
// @route   DELETE /api/v1/presentations/:id
// @access  Private
exports.deletePresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findById(req.params.id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found',
      });
    }

    // Check ownership
    if (presentation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this presentation',
      });
    }

    await presentation.deleteOne();

    logger.info(`Presentation deleted: ${req.params.id} by user ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Presentation deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete presentation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete presentation',
    });
  }
};

// @desc    Upload document and create presentation
// @route   POST /api/v1/presentations/upload
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a document',
      });
    }

    const { title, slideCount = 10 } = req.body;

    // Calculate processing cost
    const processingCost = creditSystem.calculateDocumentProcessingCost(
      req.file.size
    );
    const generationCost = creditSystem.calculateSlideGenerationCost(
      slideCount,
      true,
      false
    );
    const totalCost = processingCost + generationCost;

    // Check credits
    if (req.user.credits < totalCost) {
      return res.status(403).json({
        success: false,
        message: `Insufficient credits. Required: ${totalCost}, Available: ${req.user.credits}`,
      });
    }

    // Extract text from document
    const extracted = await documentService.extractText(
      req.file.path,
      req.file.mimetype
    );

    // Create presentation
    const presentation = await Presentation.create({
      user: req.user.id,
      title: title || req.file.originalname,
      sourceType: 'document',
      sourceDocument: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadDate: new Date(),
        textExtracted: extracted.text,
      },
      status: 'analyzing',
    });

    // Deduct credits
    await creditSystem.deductCredits(
      req.user.id,
      totalCost,
      'document_processing',
      `Document processing and generation: ${req.file.originalname}`,
      { presentationId: presentation._id }
    );

    // Generate outline
    const outline = await geminiService.generateOutlineFromDocument(
      extracted.text,
      slideCount
    );

    presentation.outline = outline;
    presentation.status = 'completed';
    await presentation.save();

    // Clean up uploaded file
    await documentService.deleteFile(req.file.path);

    // Update user stats
    await req.user.updateOne({
      $inc: {
        'usage.presentationsCreated': 1,
        'usage.slidesGenerated': slideCount,
      },
    });

    logger.info(`Document uploaded and processed: ${presentation._id}`);

    res.status(201).json({
      success: true,
      message: 'Document processed successfully',
      data: presentation,
      creditsUsed: totalCost,
    });
  } catch (error) {
    logger.error(`Upload document error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to process document',
      error: error.message,
    });
  }
};
