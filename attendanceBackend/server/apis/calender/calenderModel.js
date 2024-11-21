const mongoose = require('mongoose');

const calenderSchema = new mongoose.Schema({
  calenderId: {
    type: Number,
    required: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  employeeIds: {
    type: [String], // Array of employee IDs
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending',  'completed'],
    default: 'pending'
},
});

const Calendar = mongoose.model('Calendar', calenderSchema);

module.exports = Calendar;
