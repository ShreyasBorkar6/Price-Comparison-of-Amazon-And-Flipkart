const mongoose = require('mongoose');

// Define the schema for a Bookmark
const BookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
}, { timestamps: true });

// Export the Bookmark model
module.exports = mongoose.model('Bookmark', BookmarkSchema);