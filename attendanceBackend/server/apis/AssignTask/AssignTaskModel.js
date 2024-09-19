const mongoose = require('mongoose');

// Task Assignment Schema
const taskAssignmentSchema = new mongoose.Schema({
    AssignId: {
        type: Number,
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'task'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    },
    EmployeeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'employee'
    },
    rating:{
        type:Number
    },
    feedback: {
        type:String
    },
    assignedDays: {
        type: [
            {
                day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
                date: { type: String, required: true }
            }
        ],
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending','started', 'waiting for approval', 'completed'],
        default: 'pending'
    }
});

const TaskAssignment = mongoose.model('TaskAssignment', taskAssignmentSchema);

module.exports = TaskAssignment;
