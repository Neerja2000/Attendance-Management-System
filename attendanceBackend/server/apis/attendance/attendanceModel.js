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
  break_time: {
    type: String,
   
  },
  check_out: {
    type: String,
   
  },
  work_done: {
    type: String,
   
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
