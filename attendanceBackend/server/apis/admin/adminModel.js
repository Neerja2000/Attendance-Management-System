const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminId: {
    type: Number,
    required: true
  },
  name:{
type:String,

  },
  email: {
    type: String,
    required: true
  },


  password: {
    type: String,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now

  },
  status: {
    type: Boolean,
    default: true
  }

});

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;