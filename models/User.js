const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.models.User || mongoose.model('User', schema);