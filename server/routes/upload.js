const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database/init');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow medical file types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload medical files
router.post('/', upload.array('files', 5), (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];

    req.files.forEach(file => {
      const fileData = {
        sessionId,
        filename: file.filename,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadPath: `/uploads/${file.filename}`
      };

      // Save file info to database
      const stmt = db.prepare(`
        INSERT INTO uploaded_files (session_id, filename, original_name, file_type, file_size, upload_path)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        fileData.sessionId,
        fileData.filename,
        fileData.originalName,
        fileData.fileType,
        fileData.fileSize,
        fileData.uploadPath
      ], function(err) {
        if (err) {
          console.error('Error saving file info:', err);
        }
      });

      stmt.finalize();

      uploadedFiles.push({
        id: this.lastID,
        originalName: fileData.originalName,
        fileType: fileData.fileType,
        fileSize: fileData.fileSize,
        uploadPath: fileData.uploadPath
      });
    });

    res.json({
      sessionId,
      uploadedFiles,
      message: 'Files uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Get uploaded files for a session
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    const stmt = db.prepare(`
      SELECT * FROM uploaded_files 
      WHERE session_id = ? 
      ORDER BY created_at DESC
    `);

    stmt.all([sessionId], (err, files) => {
      if (err) {
        console.error('Error fetching uploaded files:', err);
        return res.status(500).json({ error: 'Failed to fetch uploaded files' });
      }

      res.json({
        sessionId,
        files,
        message: 'Uploaded files retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete uploaded file
router.delete('/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;

    // Get file info before deletion
    const getFileStmt = db.prepare(`
      SELECT * FROM uploaded_files WHERE id = ?
    `);

    getFileStmt.get([fileId], (err, file) => {
      if (err) {
        console.error('Error fetching file:', err);
        return res.status(500).json({ error: 'Failed to fetch file' });
      }

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Delete file from filesystem
      const filePath = path.join(__dirname, '..', file.upload_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete file record from database
      const deleteStmt = db.prepare(`
        DELETE FROM uploaded_files WHERE id = ?
      `);

      deleteStmt.run([fileId], function(err) {
        if (err) {
          console.error('Error deleting file record:', err);
          return res.status(500).json({ error: 'Failed to delete file record' });
        }

        res.json({
          message: 'File deleted successfully'
        });
      });

      deleteStmt.finalize();
    });

    getFileStmt.finalize();
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get file by ID
router.get('/file/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;

    const stmt = db.prepare(`
      SELECT * FROM uploaded_files WHERE id = ?
    `);

    stmt.get([fileId], (err, file) => {
      if (err) {
        console.error('Error fetching file:', err);
        return res.status(500).json({ error: 'Failed to fetch file' });
      }

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.json({
        file,
        message: 'File retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 5 files.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field.' });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }

  console.error('Upload error:', error);
  res.status(500).json({ error: 'File upload failed' });
});

module.exports = router; 