const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: Number,
    required: true
  },
  employeeIds: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee',
    default: null
  }],
  projectName: {
    type: String,
    default: null,
    required: true
  },
  projectDescription: {
    type: String,
    default: null,
    required: true
  },
  document: {
    type: String,
    default: null
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

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
