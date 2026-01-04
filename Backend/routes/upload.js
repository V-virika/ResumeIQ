const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const Resume = require('../models/Resume');
const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Define GET route for root
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Resume Recommendation System API',
    endpoints: {
      'POST /upload': 'Upload a resume file',
      'GET /': 'API information'
    },
    status: 'Server is running'
  });
});

// Define POST /upload route
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Use Python parser to extract resume data
    exec(`python parser.py ${filePath}`, async (error, stdout, stderr) => {
      try {
        if (error) {
          console.error('Parser error:', stderr);
          // If parser fails, use sample data
          const resumeData = {
            fileName: fileName,
            filePath: filePath,
            uploadDate: new Date(),
            parsedData: {
              message: 'Resume uploaded but parsing failed. Please install pyresparser: pip install pyresparser',
              fileName: fileName,
              error: stderr || error.message
            }
          };

          const resume = new Resume(resumeData);
          await resume.save();

          return res.status(200).json({
            success: true,
            message: 'Resume uploaded but parsing failed',
            data: resumeData.parsedData,
            resumeId: resume._id
          });
        }

        // Parse the Python output
        const parsedData = JSON.parse(stdout);

        // Save to MongoDB
        const resumeData = {
          fileName: fileName,
          filePath: filePath,
          uploadDate: new Date(),
          parsedData: parsedData
        };

        const resume = new Resume(resumeData);
        await resume.save();

        res.status(200).json({
          success: true,
          message: 'Resume uploaded and parsed successfully!',
          data: parsedData,
          resumeId: resume._id
        });

      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(500).json({ error: 'Error parsing resume data: ' + parseError.message });
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error processing upload: ' + error.message });
  }
});

module.exports = router;
