// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// require('dotenv').config();
// console.log("ghgh");

// const app = express();
// app.use(express.json());
// app.use(cors());
// // הגדרת ה־transport
// const transporter = nodemailer.createTransport({
//   service: 'gmail',     
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });

// app.post('/api/contact', async (req, res) => {
//   const { name, phone, email, message } = req.body;
//   if (!name || !phone || !email || !message) {
//     return res.status(400).json({ error: 'Missing fields.' });
//   }

//   try {
//     console.log(`"${name}"`);

//     await transporter.sendMail({
//       from: `"${name}" <${email}>`,
//       to: process.env.MAIL_USER,
//       subject: 'New Contact Form Submission',
//       text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
//     });
//     res.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to send email.' });
//   }
// });

// const hostname="localhost"
// const port = 3001
// app.listen(port, hostname, ()=>{
//     console.log(`Server running at ${hostname}:${port}`);
// })
/**
 * server.js
 * Express server for Volume Studio backend
 * - listens on process.env.PORT
 * - binds to 0.0.0.0 for cloud providers (Render, Heroku etc.)
 * - connects to MongoDB if MONGO_URL provided
 * - endpoints: /api/contact, /api/auth/login, /api/gallery, /api/packages, /api/testimonials
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB connection (optional, only if MONGO_URL is set) ---
const MONGO_URL = process.env.MONGO_URL || '';
if (MONGO_URL) {
  mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// --- Schemas & Models (Mongoose) ---
const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
});
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

const gallerySchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  audioUrl: String,
  videoUrl: String,
  date: { type: Date, default: Date.now },
});
const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

const packageSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  date: { type: Date, default: Date.now },
});
const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);

const testimonialSchema = new mongoose.Schema({
  name: String,
  review: String,
  date: { type: Date, default: Date.now },
});
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

const userSchema = new mongoose.Schema({
  username: String,
  passwordHash: String, // bcrypt hash
  role: { type: String, default: 'admin' },
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- Utility: auth middleware ---
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Nodemailer setup ---
const transporter = nodemailer.createTransport({
  // using Gmail here, for production consider SendGrid/Mailgun/SES
  service: process.env.MAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// --- Routes ---

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date() }));

// Contact: send email & save to DB (if connected)
app.post('/api/contact', async (req, res) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_USER,
      subject: `Contact form - ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
    });

    // save to DB if available
    if (mongoose.connection.readyState === 1) {
      await Contact.create({ name, phone, email, message });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ error: 'Failed to send' });
  }
});

// Auth: admin registration (run once locally) and login
app.post('/api/auth/register', async (req, res) => {
  // NOTE: protect this route in production or run only locally to create admin
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing' });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const u = await User.create({ username, passwordHash });
  res.json({ ok: true, id: u._id });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token });
});

// Gallery CRUD
app.get('/api/gallery', async (req, res) => {
  const items = await Gallery.find().sort({ date: -1 });
  res.json(items);
});
app.post('/api/gallery', authMiddleware, async (req, res) => {
  const item = await Gallery.create(req.body);
  res.json(item);
});
app.put('/api/gallery/:id', authMiddleware, async (req, res) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});
app.delete('/api/gallery/:id', authMiddleware, async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Packages CRUD
app.get('/api/packages', async (req, res) => {
  const items = await Package.find().sort({ date: -1 });
  res.json(items);
});
app.post('/api/packages', authMiddleware, async (req, res) => {
  const item = await Package.create(req.body);
  res.json(item);
});
app.put('/api/packages/:id', authMiddleware, async (req, res) => {
  const item = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});
app.delete('/api/packages/:id', authMiddleware, async (req, res) => {
  await Package.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Testimonials CRUD
app.get('/api/testimonials', async (req, res) => {
  const items = await Testimonial.find().sort({ date: -1 });
  res.json(items);
});
app.post('/api/testimonials', authMiddleware, async (req, res) => {
  const item = await Testimonial.create(req.body);
  res.json(item);
});
app.delete('/api/testimonials/:id', authMiddleware, async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// --- start server properly for cloud providers ---
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});