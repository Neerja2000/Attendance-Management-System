const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  AttendanceId: {
    type: Number,
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'employee'
  },
  check_in: {
    type: String,
    required: true
  },
  break: {
    type: String,
    required: true
  },
  check_out: {
    type: String,
    required: true
  },
  work_done: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['absent', 'present'],
    default: 'present'
  }
  
});

const Attendance = mongoose.model('attendance', attendanceSchema);

module.exports = Attendance;
