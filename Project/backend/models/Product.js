const mongoose = require('mongoose');

// Define the schema for a Product
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  productUrl: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  source: { // e.g., 'Amazon', 'Flipkart', 'Myntra'
    type: String,
    required: true,
  },
  searchQuery: { // The original query used to find the product
    type: String,
    required: true,
  }
}, { timestamps: true });

// Export the Product model
module.exports = mongoose.model('Product', ProductSchema);