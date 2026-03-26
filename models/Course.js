const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // The URL slug (e.g., 'cake-baking-frosting')
  category: { type: String, required: true }, // 'Baking', 'Cooking', or 'Workshops'
  title: { type: String, required: true },
  hasTiers: { type: Boolean, default: false },
  image: { type: String, required: true },
  description: { type: String, required: true },
  basic: {
    price: String,
    items: [String]
  },
  advanced: {
    price: String,
    items: [String]
  }
});

module.exports = mongoose.model('Course', courseSchema);