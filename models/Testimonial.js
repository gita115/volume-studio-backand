const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String,
  review: String,
  rating: { type: Number, default: 5 },
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.models.Testimonial || mongoose.model('Testimonial', schema);