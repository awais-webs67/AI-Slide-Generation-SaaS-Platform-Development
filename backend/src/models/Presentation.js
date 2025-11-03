const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  slideNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Flexible content structure
    required: true,
  },
  sketch: {
    description: String,
    layout: String,
    visualElements: [String],
    colorScheme: String,
  },
  code: {
    html: String,
    css: String,
  },
  thumbnailUrl: String,
  status: {
    type: String,
    enum: ['pending', 'generating', 'completed', 'failed'],
    default: 'pending',
  },
  customizationHistory: [
    {
      prompt: String,
      timestamp: Date,
      creditsUsed: Number,
    },
  ],
  generatedAt: Date,
});

const presentationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    sourceType: {
      type: String,
      enum: ['document', 'prompt', 'template'],
      required: true,
    },
    sourceDocument: {
      filename: String,
      originalName: String,
      size: Number,
      mimeType: String,
      uploadDate: Date,
      textExtracted: String,
    },
    sourcePrompt: {
      type: String,
      maxlength: 5000,
    },
    slides: [slideSchema],
    slideCount: {
      type: Number,
      default: 0,
    },
    outline: {
      type: mongoose.Schema.Types.Mixed,
      // Structured outline from AI
    },
    theme: {
      name: {
        type: String,
        default: 'professional',
      },
      primaryColor: {
        type: String,
        default: '#3B82F6',
      },
      secondaryColor: {
        type: String,
        default: '#1F2937',
      },
      fontFamily: {
        type: String,
        default: 'Inter',
      },
      template: String,
    },
    status: {
      type: String,
      enum: [
        'draft',
        'analyzing',
        'outlining',
        'sketching',
        'generating',
        'completed',
        'failed',
      ],
      default: 'draft',
    },
    progress: {
      currentStep: String,
      currentSlide: Number,
      totalSlides: Number,
      percentage: {
        type: Number,
        default: 0,
      },
    },
    exports: [
      {
        format: {
          type: String,
          enum: ['pdf', 'pptx', 'html'],
        },
        url: String,
        filename: String,
        size: Number,
        creditsUsed: Number,
        exportedAt: {
          type: Date,
          default: Date.now,
        },
        expiresAt: Date,
      },
    ],
    credits: {
      generation: {
        type: Number,
        default: 0,
      },
      customization: {
        type: Number,
        default: 0,
      },
      export: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
    metadata: {
      aiModel: String,
      generationTime: Number, // in seconds
      wordCount: Number,
      errorLogs: [
        {
          message: String,
          timestamp: Date,
          context: mongoose.Schema.Types.Mixed,
        },
      ],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareToken: String,
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
presentationSchema.index({ user: 1, createdAt: -1 });
presentationSchema.index({ status: 1 });
presentationSchema.index({ shareToken: 1 });
presentationSchema.index({ tags: 1 });

// Update slideCount when slides array changes
presentationSchema.pre('save', function (next) {
  this.slideCount = this.slides.length;
  next();
});

// Virtual for completed slides
presentationSchema.virtual('completedSlides').get(function () {
  return this.slides.filter((slide) => slide.status === 'completed').length;
});

module.exports = mongoose.model('Presentation', presentationSchema);
