const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  AttendanceId: {
    type: Number,
   
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'employee'
  },
  check_in: {
    type: String,
   
  },
  break_time_start: {
    type: String,
   
  },
  break_time_finish: {
    type: String,
   
  },
  check_out: {
    type: String,
   
  },
  work_done: {
    type: String,
   
  },
  date: {  // New field to store the date of the attendance
    type: Date,
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
