const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  joining_date: {
    type: String,
    required: true
  },
  salary: {
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

const Employee = mongoose.model('employee', employeeSchema);

module.exports = Employee;