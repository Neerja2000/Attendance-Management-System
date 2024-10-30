const mongoose = require('mongoose');

const impContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description:{type:String},
  link:{type:String},
  files: [{ type: String }], // Array to store multiple file paths
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminContent', impContentSchema);
