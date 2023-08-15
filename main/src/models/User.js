const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (username) => /[a-zA-Z0-9_-]{3,20}/.test(username),
      message: 'Username must be between 3-20 characters and only contain lowercase/uppercase letters, numbers, _ or -'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (email) => /\S+@\S+\.\S+/.test(email),
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true
  },
  verificationKey: {
    type: String
  },
  verificationKeyExpires: {
    type: Date
  },
  recoveryToken: {
    type: String
  },
  recoveryTokenExpires: {
    type: Date
  },
  lockedReason: {
    type: String,
    required: false,
    enum: ["Unverified", "Self-deactivated", "Banned"]
  }
});

module.exports = User = mongoose.model('user', userSchema);