const mongoose = require('mongoose');

const workStatusSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee',
    required: true
  },
  workStatus: {
    type: String,
    enum: ['In Progress', 'Completed'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  workTitle: {
    type: String,
    required: true
  },
  workDescription: {
    type: String,
    required: true
  },
  difficultyLevel:{
    type: String,
    enum: ['Easy', 'Medium','Hard'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkStatus', workStatusSchema);
