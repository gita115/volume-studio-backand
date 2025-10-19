const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  features: [String],
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.models.Package || mongoose.model('Package', schema);