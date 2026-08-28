const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ErrorResponse } = require('./errorHandler');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Allowed MIME types and extensions
const ALLOWED_EXTENSIONS = /jpeg|jpg|png|gif|webp|pdf|ppt|pptx|doc|docx|mp4|webm|mkv|mp3|wav/;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'video/mp4',
  'video/webm',
  'video/x-matroska',
  'audio/mpeg',
  'audio/wav'
];

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Sanitize original name and generate unique timestamp suffix
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const extname = ALLOWED_EXTENSIONS.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = ALLOWED_MIME_TYPES.includes(file.mimetype) ||
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype.startsWith('audio/') ||
    file.mimetype.includes('pdf') ||
    file.mimetype.includes('document') ||
    file.mimetype.includes('presentation');

  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse(
        `File type not allowed. Supported formats: PDF, PPT, PPTX, DOC, DOCX, JPG, PNG, GIF, MP4, WEBM.`,
        400
      ),
      false
    );
  }
};

// Multer upload instance (100MB limit)
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB
  },
  fileFilter
});

/**
 * Upload a single file (default field name: 'file')
 * @param {string} [fieldName='file']
 */
const uploadFile = (fieldName = 'file') => upload.single(fieldName);

/**
 * Upload multiple files (default field name: 'files', max 10)
 * @param {string} [fieldName='files']
 * @param {number} [maxCount=10]
 */
const uploadFiles = (fieldName = 'files', maxCount = 10) => upload.array(fieldName, maxCount);

module.exports = {
  upload,
  uploadFile,
  uploadFiles,
  uploadsDir
};
