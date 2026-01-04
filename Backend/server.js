const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const uploadRouter = require('./routes/upload');
const mongoose = require('mongoose');
const { startMongoServer } = require('./mongodb-setup');
require('dotenv').config();

const app = express();

// Start MongoDB Memory Server and connect
async function startServer() {
  try {
    // Start in-memory MongoDB server
    const mongoUri = await startMongoServer();
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected successfully');

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.static('uploads')); // Serve static files from the uploads folder

    // Routes
    app.use('/', uploadRouter);

    console.log('uploadRouter:', uploadRouter);
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Ready to accept requests`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
