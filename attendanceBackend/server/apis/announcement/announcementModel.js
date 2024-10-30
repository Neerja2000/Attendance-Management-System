const mongoose = require('mongoose');

// Define comment schema
// Define comment schema
const commentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'userModel' 
  },
  userModel: { 
    type: String, 
   
    enum: ['Employee', 'Admin'] 
  },
  name: { // Add name field
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Define announcement schema
const announcementSchema = new mongoose.Schema({
  announcementId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  media: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0 // Initialize likes count to 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Track users who liked the announcement
  }],
  comments: [commentSchema], // Array of comments
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// Register the model
const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
