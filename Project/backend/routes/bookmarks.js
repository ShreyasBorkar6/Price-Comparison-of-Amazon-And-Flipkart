const express = require('express');
const router = express.Router();
const { addBookmark, getBookmarks, deleteBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

// The `protect` middleware is used here to secure these routes.
// A valid JWT token must be provided in the request header.

// @route   POST /api/bookmarks
// @desc    Add a product to bookmarks
// @access  Private
router.post('/', protect, addBookmark);

// @route   GET /api/bookmarks
// @desc    Get all bookmarks for the logged-in user
// @access  Private
router.get('/', protect, getBookmarks);

// @route   DELETE /api/bookmarks/:bookmarkId
// @desc    Remove a product from bookmarks
// @access  Private
router.delete('/:bookmarkId', protect, deleteBookmark);

module.exports = router;