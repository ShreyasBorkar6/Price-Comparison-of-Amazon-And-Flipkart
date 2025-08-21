const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for a User
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return the password field by default
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookmark'
  }]
}, { timestamps: true });

// Pre-save hook to hash the password before saving a new user
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare the entered password with the hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt.compare to check if the passwords match
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);