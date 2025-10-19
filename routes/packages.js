const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', async (req, res) => {
  const items = await Package.find().sort({ date: -1 });
  res.json(items);
});

router.post('/', auth, async (req, res) => {
  const item = await Package.create(req.body);
  res.json(item);
});

router.put('/:id', auth, async (req, res) => {
  const item = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', auth, async (req, res) => {
  await Package.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;