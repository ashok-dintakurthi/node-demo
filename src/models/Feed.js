const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['basic', 'admin', 'superadmin'] },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true }
);

const Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
