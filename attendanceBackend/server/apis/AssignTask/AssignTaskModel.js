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
    rating: {
        type: Number,
    },
    review: {
        type: String, // Allows admins to add a review
    },
    feedback: { type: [String], default: [] }, 
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
        enum: ['pending', 'started', 'waiting for approval', 'completed', 'under revision', 'Under Revision: Approval Pending'],
        default: 'pending'
    },
    revisionCount: { type: Number, default: 0 },
    urgent: { 
        type: Boolean, 
        default: false // Default to not urgent 
    }
});

const TaskAssignment = mongoose.model('TaskAssignment', taskAssignmentSchema);

module.exports = TaskAssignment;
