const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// Nodemailer transport
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_USER,
      subject: `Contact form - ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`
    });

    // save to DB if model exists
    try {
      await Contact.create({ name, phone, email, message });
    } catch (saveErr) {
      console.warn('Could not save contact to DB:', saveErr.message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Contact error', err);
    res.status(500).json({ error: 'Failed to send' });
  }
});

module.exports = router;