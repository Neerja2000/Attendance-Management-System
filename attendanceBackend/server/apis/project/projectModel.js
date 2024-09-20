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
  projectBudget: {
    type: Number,  // Define the new field as a number
    required: true  // Make this field required
  },
  files: [{
    type: String,
    default: []
}],
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    default: true
  },
  TotalProjectBudgets: {
    type: Number,
    default: 0 // Set default to 0
},
RemainingBudget: {
  type: Number,  // Add this field to store the remaining budget
  default: 0,
}
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
