const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    default: 'Standard',
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Enquiry', enquirySchema);