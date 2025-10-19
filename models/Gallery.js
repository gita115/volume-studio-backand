const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  audioUrl: String,
  videoUrl: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.models.Gallery || mongoose.model('Gallery', schema);