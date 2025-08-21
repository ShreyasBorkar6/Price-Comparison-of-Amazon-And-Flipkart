const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const Product = require('../models/Product'); // Assuming you want to populate product details

// @desc    Add a product to bookmarks
// @route   POST /api/bookmarks
// @access  Private
exports.addBookmark = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id; // User ID from the JWT token

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    // Check if the product and user exist
    const productExists = await Product.findById(productId);
    const userExists = await User.findById(userId);

    if (!productExists) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({ user: userId, product: productId });
    if (existingBookmark) {
      return res.status(409).json({ message: 'Product is already bookmarked.' });
    }

    // Create a new bookmark
    const bookmark = new Bookmark({
      user: userId,
      product: productId,
    });

    await bookmark.save();

    // Optionally, push the bookmark reference to the user's bookmarks array
    userExists.bookmarks.push(bookmark._id);
    await userExists.save();

    res.status(201).json({ message: 'Product bookmarked successfully!', bookmark });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bookmarks for the logged-in user
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find all bookmarks for the user and populate the product details
    const bookmarks = await Bookmark.find({ user: userId }).populate('product');

    if (!bookmarks) {
      return res.status(404).json({ message: 'No bookmarks found.' });
    }

    res.status(200).json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove a product from bookmarks
// @route   DELETE /api/bookmarks/:bookmarkId
// @access  Private
exports.deleteBookmark = async (req, res) => {
  const { bookmarkId } = req.params;
  const userId = req.user._id;

  try {
    // Find the bookmark and ensure it belongs to the logged-in user
    const bookmark = await Bookmark.findOne({ _id: bookmarkId, user: userId });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found or unauthorized.' });
    }

    await bookmark.deleteOne(); // Use deleteOne() instead of remove() which is deprecated

    // Optionally, remove the bookmark reference from the user's bookmarks array
    await User.findByIdAndUpdate(userId, { $pull: { bookmarks: bookmarkId } });

    res.status(200).json({ message: 'Bookmark removed successfully!' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
};