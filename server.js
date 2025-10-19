const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
console.log("ghgh");

const app = express();
app.use(express.json());
app.use(cors());
// הגדרת ה־transport
const transporter = nodemailer.createTransport({
  service: 'gmail',     
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: 'Missing fields.' });
  }

  try {
    console.log(`"${name}"`);

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_USER,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

const hostname="localhost"
const port = 3001
app.listen(port, hostname, ()=>{
    console.log(`Server running at ${hostname}:${port}`);
})
