const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'projects'
    },
    taskName: {
        type: String,
        default: null,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    expectedTime: {
        type: String,
        default: null
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
    }
});

const task = mongoose.model('task', taskSchema);
module.exports = task;
