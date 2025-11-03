# 🔨 Implementation Guide - Remaining Features

This guide details how to implement the remaining features of the AI Slides Platform.

## ✅ Already Implemented

- ✅ User authentication (register, login, JWT tokens)
- ✅ MongoDB models (User, Presentation, Transaction, SystemLog)
- ✅ Credit system with transaction tracking
- ✅ Document processing service (PDF, DOCX, TXT extraction)
- ✅ Google Gemini AI service integration
- ✅ Rate limiting with Redis
- ✅ Logging system with Winston
- ✅ Security middleware (Helmet, CORS, validation)
- ✅ Docker Compose setup

## 🚧 To Be Implemented

### 1. Presentation Controller (HIGH PRIORITY)

**File**: `backend/src/controllers/presentationController.js`

**What to implement**:
- List all presentations for logged-in user
- Create new presentation from document upload
- Create new presentation from prompt
- Get presentation details by ID
- Update presentation metadata
- Delete presentation

**Key functions**:
```javascript
exports.getAllPresentations = async (req, res) => {
  // Get all presentations for req.user.id
  // Support pagination, filtering, sorting
  // Return: presentations array with basic info
}

exports.createPresentation = async (req, res) => {
  // 1. Validate input (title, sourceType, sourcePrompt/sourceDocument)
  // 2. Check user credits
  // 3. Create presentation record with status='draft'
  // 4. Queue generation job (BullMQ)
  // 5. Return presentation ID and status
}

exports.getPresentationById = async (req, res) => {
  // 1. Find presentation by ID
  // 2. Verify ownership (req.user.id matches presentation.user)
  // 3. Populate slides array
  // 4. Return full presentation details
}
```

**Integration points**:
- Use `documentService` for text extraction
- Use `geminiService` for outline generation
- Use `creditSystem` for deducting credits
- Queue jobs with BullMQ for async processing

---

### 2. Slide Generation Job Queue (HIGH PRIORITY)

**File**: `backend/src/jobs/slideGenerationJob.js`

**What to implement**:
- BullMQ worker to process slide generation
- Multi-step pipeline: analyze → outline → sketch → generate
- Real-time progress updates
- Error handling and retry logic

**Pipeline steps**:
```javascript
// Step 1: Analyze document or prompt
async function analyzeSource(presentation) {
  if (presentation.sourceType === 'document') {
    // Extract text from uploaded document
    const extracted = await documentService.extractText(...)
    // Analyze document structure
    const analysis = await documentService.analyzeDocument(extracted.text)
    return { text: extracted.text, analysis }
  } else {
    // Use prompt directly
    return { text: presentation.sourcePrompt }
  }
}

// Step 2: Generate outline
async function generateOutline(text, slideCount) {
  const outline = await geminiService.generateOutlineFromDocument(text, slideCount)
  // Update presentation.outline
  // Update presentation.progress
  return outline
}

// Step 3: Generate sketches for each slide
async function generateSketches(outline, theme) {
  const sketches = []
  for (const slide of outline.slides) {
    const sketch = await geminiService.generateSlideSketch(slide, theme)
    sketches.push(sketch)
    // Update progress: "Sketching slide X of Y"
  }
  return sketches
}

// Step 4: Generate code for each slide
async function generateSlideCode(outline, sketches, theme) {
  const slides = []
  for (let i = 0; i < outline.slides.length; i++) {
    const slideData = outline.slides[i]
    const sketch = sketches[i]
    
    const code = await geminiService.generateSlideCode(slideData, sketch, theme)
    
    // Create slide document
    slides.push({
      slideNumber: i + 1,
      title: slideData.title,
      content: slideData,
      sketch: sketch,
      code: code,
      status: 'completed'
    })
    
    // Update progress: "Generating slide X of Y"
    // Deduct credits for slide generation
  }
  return slides
}

// Main job handler
exports.processSlideGeneration = async (job) => {
  const { presentationId } = job.data
  
  try {
    // 1. Load presentation
    const presentation = await Presentation.findById(presentationId)
    
    // 2. Update status to 'analyzing'
    presentation.status = 'analyzing'
    await presentation.save()
    
    // 3. Analyze source
    const source = await analyzeSource(presentation)
    
    // 4. Generate outline
    presentation.status = 'outlining'
    const outline = await generateOutline(source.text, 10)
    presentation.outline = outline
    await presentation.save()
    
    // 5. Generate sketches
    presentation.status = 'sketching'
    const sketches = await generateSketches(outline, presentation.theme)
    
    // 6. Generate slides
    presentation.status = 'generating'
    const slides = await generateSlideCode(outline, sketches, presentation.theme)
    
    // 7. Save slides
    presentation.slides = slides
    presentation.status = 'completed'
    presentation.progress.percentage = 100
    await presentation.save()
    
    return { success: true, presentationId }
  } catch (error) {
    // Handle errors, update presentation status to 'failed'
    // Log error
    throw error
  }
}
```

**Setup BullMQ**:
```javascript
// backend/src/config/queue.js
const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Create queue
const slideGenerationQueue = new Queue('slideGeneration', { connection });

// Create worker
const worker = new Worker('slideGeneration', processSlideGeneration, {
  connection,
  concurrency: 2  // Process 2 jobs simultaneously
});

module.exports = { slideGenerationQueue };
```

---

### 3. Export Services (MEDIUM PRIORITY)

**File**: `backend/src/services/exportService.js`

#### PDF Export with Puppeteer

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

exports.exportToPDF = async (presentation) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Generate HTML for all slides
    const html = generatePresentationHTML(presentation);
    await page.setContent(html);
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true
    });
    
    // Save to exports directory
    const filename = `presentation-${presentation._id}-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../../exports', filename);
    await fs.writeFile(filepath, pdfBuffer);
    
    return {
      filename,
      filepath,
      size: pdfBuffer.length,
      url: `/exports/${filename}`
    };
  } finally {
    await browser.close();
  }
};

function generatePresentationHTML(presentation) {
  // Combine all slides into single HTML document
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { size: 1920px 1080px; margin: 0; }
        .slide { page-break-after: always; width: 1920px; height: 1080px; }
        ${presentation.slides.map(s => s.code.css).join('\n')}
      </style>
    </head>
    <body>
  `;
  
  presentation.slides.forEach(slide => {
    html += `<div class="slide">${slide.code.html}</div>`;
  });
  
  html += `</body></html>`;
  return html;
}
```

#### PPTX Export with PptxGenJS

```javascript
const PptxGenJS = require('pptxgenjs');

exports.exportToPPTX = async (presentation) => {
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.author = 'AI Slides Platform';
  pptx.title = presentation.title;
  pptx.subject = presentation.description || '';
  
  // Set default layout (16:9)
  pptx.layout = 'LAYOUT_WIDE';
  
  // Add each slide
  for (const slide of presentation.slides) {
    const pptxSlide = pptx.addSlide();
    
    // Add title
    pptxSlide.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 32,
      bold: true,
      color: presentation.theme.primaryColor || '0088CC'
    });
    
    // Add content based on slide type
    if (slide.content.mainPoints && slide.content.mainPoints.length > 0) {
      // Add bullet points
      pptxSlide.addText(slide.content.mainPoints, {
        x: 0.5,
        y: 1.8,
        w: 9,
        h: 4,
        fontSize: 20,
        bullet: true
      });
    }
    
    // Add notes
    if (slide.content.notes) {
      pptxSlide.addNotes(slide.content.notes);
    }
  }
  
  // Save file
  const filename = `presentation-${presentation._id}-${Date.now()}.pptx`;
  const filepath = path.join(__dirname, '../../exports', filename);
  await pptx.writeFile({ fileName: filepath });
  
  const stats = await fs.stat(filepath);
  
  return {
    filename,
    filepath,
    size: stats.size,
    url: `/exports/${filename}`
  };
};
```

**Export Controller**:
```javascript
// backend/src/controllers/exportController.js
exports.exportPresentation = async (req, res) => {
  const { format } = req.body;  // 'pdf' or 'pptx'
  const presentationId = req.params.id;
  
  try {
    // 1. Load presentation
    const presentation = await Presentation.findById(presentationId);
    
    // 2. Verify ownership
    if (presentation.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // 3. Check credits
    const cost = creditSystem.calculateExportCost(format);
    if (req.user.credits < cost) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient credits',
        required: cost,
        available: req.user.credits
      });
    }
    
    // 4. Deduct credits
    await creditSystem.deductCredits(
      req.user.id,
      cost,
      `export_${format}`,
      `Export ${format.toUpperCase()}: ${presentation.title}`
    );
    
    // 5. Generate export
    let result;
    if (format === 'pdf') {
      result = await exportService.exportToPDF(presentation);
    } else if (format === 'pptx') {
      result = await exportService.exportToPPTX(presentation);
    }
    
    // 6. Save export record
    presentation.exports.push({
      format,
      url: result.url,
      filename: result.filename,
      size: result.size,
      creditsUsed: cost,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)  // 24 hours
    });
    await presentation.save();
    
    // 7. Return download URL
    res.json({
      success: true,
      data: {
        downloadUrl: result.url,
        filename: result.filename,
        format,
        size: result.size,
        expiresAt: presentation.exports[presentation.exports.length - 1].expiresAt
      }
    });
  } catch (error) {
    logger.error(`Export error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
};
```

---

### 4. File Upload Middleware (HIGH PRIORITY)

**File**: `backend/src/middleware/upload.js`

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT allowed.'), false);
  }
};

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024  // 500MB default
  }
});

module.exports = upload;
```

**Usage in routes**:
```javascript
const upload = require('../middleware/upload');

router.post('/presentations/upload', 
  protect,
  uploadLimiter,
  upload.single('document'),
  async (req, res) => {
    try {
      const file = req.file;
      const { title, slideCount } = req.body;
      
      // Calculate processing cost
      const processingCost = creditSystem.calculateDocumentProcessingCost(file.size);
      
      // Extract text
      const extracted = await documentService.extractText(file.path, file.mimetype);
      
      // Create presentation
      const presentation = await Presentation.create({
        user: req.user.id,
        title: title || file.originalname,
        sourceType: 'document',
        sourceDocument: {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          uploadDate: new Date(),
          textExtracted: extracted.text
        },
        status: 'draft'
      });
      
      // Deduct processing credits
      await creditSystem.deductCredits(
        req.user.id,
        processingCost,
        'document_processing',
        `Document processing: ${file.originalname}`
      );
      
      // Clean up uploaded file (text is saved in DB)
      await documentService.deleteFile(file.path);
      
      res.json({
        success: true,
        data: presentation,
        creditsUsed: processingCost
      });
    } catch (error) {
      logger.error(`Upload error: ${error.message}`);
      res.status(500).json({ success: false, message: 'Upload failed' });
    }
  }
);
```

---

### 5. Frontend Application (MEDIUM PRIORITY)

**Technology**: Next.js 14 + React 18 + Tailwind CSS + Shadcn/ui

**Structure**:
```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── presentations/[id]/page.tsx
│   │   ├── create/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/               # Shadcn components
│   │   ├── auth/             # Auth forms
│   │   ├── dashboard/        # Dashboard components
│   │   ├── editor/           # Slide editor
│   │   └── shared/           # Shared components
│   ├── lib/
│   │   ├── api.ts            # API client
│   │   ├── auth.ts           # Auth helpers
│   │   └── utils.ts          # Utilities
│   └── stores/
│       ├── authStore.ts      # Auth state (Zustand)
│       └── presentationStore.ts
└── package.json
```

**Key pages to build**:
1. Landing page with features and pricing
2. Login/Register pages
3. Dashboard with presentations list
4. Create presentation page (upload or prompt)
5. Slide editor with preview and customization
6. Export modal

---

### 6. Admin Dashboard (LOW PRIORITY)

**Features**:
- User management (list, view, edit, delete)
- Credit management (adjust balances)
- System statistics (users, presentations, revenue)
- System logs viewer
- System health monitoring

**Implementation**:
- Create admin routes that require admin role
- Build admin UI with charts and tables
- Use React Query for data fetching
- Implement real-time updates with polling or WebSocket

---

## 🎯 Implementation Priority

### Phase 1 (Week 1-2): Core Functionality
1. ✅ Presentation controller (CRUD operations)
2. ✅ File upload middleware
3. ✅ BullMQ job queue setup
4. ✅ Slide generation pipeline

### Phase 2 (Week 3): Export & Frontend
5. ✅ PDF export service
6. ✅ PPTX export service
7. ✅ Frontend authentication pages
8. ✅ Frontend dashboard

### Phase 3 (Week 4): Polish & Admin
9. ✅ Slide editor UI
10. ✅ Admin dashboard
11. ✅ Testing and bug fixes
12. ✅ Documentation

---

## 📚 Additional Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Puppeteer API](https://pptr.dev/)
- [PptxGenJS Documentation](https://gitbrent.github.io/PptxGenJS/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Zustand State Management](https://docs.pmnd.rs/zustand)

---

## 💡 Development Tips

1. **Test incrementally**: Test each feature as you build it
2. **Use mock data**: Create test presentations for development
3. **Monitor credits**: Track credit deductions carefully
4. **Error handling**: Implement comprehensive error handling
5. **Logging**: Log all important operations
6. **Security**: Validate all inputs, check permissions
7. **Performance**: Optimize AI API calls, cache when possible

---

**Ready to implement?** Start with the Presentation Controller and work your way through the phases!
