const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({

  employeeId: {
    type: Number,
    required: true
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
 
  createdAt:{
    type:Date,
    default:Date.now
   
  },
  status:{
    type:Boolean,
    default:true
  }
 
});

const Attendance = mongoose.model('attendance', attendanceSchema);

module.exports = Attendance;