// server.js - נקודת כניסה לשרת
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const galleryRoutes = require('./routes/gallery');
const packagesRoutes = require('./routes/packages');
const testimonialsRoutes = require('./routes/testimonials');

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB connection (if provided) ---
const MONGO_URL = process.env.MONGO_URL || '';
if (MONGO_URL) {
  mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGO_URL provided - running without DB');
}

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/testimonials', testimonialsRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, now: new Date().toISOString() }));

// Start server: listen on process.env.PORT and 0.0.0.0 for cloud platforms
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});