const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, requireActiveSubscription } = require('../middleware/auth');
const { generationLimiter, uploadLimiter } = require('../middleware/rateLimiter');
const presentationController = require('../controllers/presentationController');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  }
});

// All routes require authentication
router.use(protect);

// Presentation CRUD routes
router.get('/', presentationController.getAllPresentations);

router.post(
  '/',
  requireActiveSubscription,
  generationLimiter,
  presentationController.createPresentation
);

router.get('/:id', presentationController.getPresentationById);

router.put('/:id', presentationController.updatePresentation);

router.delete('/:id', presentationController.deletePresentation);

// Document upload route
router.post(
  '/upload',
  uploadLimiter,
  upload.single('document'),
  presentationController.uploadDocument
);

module.exports = router;
