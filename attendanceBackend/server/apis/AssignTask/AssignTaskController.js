const TaskAssignment = require('./AssignTaskModel');
const mongoose = require('mongoose');
const Task = require('../task/taskModel');
const Project = require('../project/projectModel');

// Assign Task to Project with Days
const assignTask = async (req, res) => {
    try {
        const { taskId, projectId } = req.body;
        let { assignedDays } = req.body;

        // Handle both string and array for assignedDays
        if (typeof assignedDays === 'string') {
            assignedDays = [assignedDays]; // Convert to array if it's a string
        }

        // Validate ObjectId formats
        if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Invalid task ID or project ID format',
            });
        }

        // Check if task and project exist
        const taskExists = await Task.findById(taskId);
        const projectExists = await Project.findById(projectId);

        if (!taskExists || !projectExists) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Task or project not found',
            });
        }

        // Validate assignedDays array
        const allowedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const isValidDays = assignedDays.every(day => allowedDays.includes(day));

        if (!isValidDays) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Invalid assigned days format',
            });
        }

        // Create a new task assignment
        let total = await TaskAssignment.countDocuments();
        const newAssignment = new TaskAssignment({
            AssignId: total + 1,
            taskId: new mongoose.Types.ObjectId(taskId),
            projectId: new mongoose.Types.ObjectId(projectId),
            assignedDays
        });

        const result = await newAssignment.save();

        res.json({
            success: true,
            status: 200,
            message: 'Task assigned successfully',
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};



// Get All Assignments
const getAllAssignments = async (req, res) => {
    try {
        const assignments = await TaskAssignment.find()
            .populate('taskId', 'taskName') // Get task name
            .populate('projectId', 'projectName'); // Get project name

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'No assignments found'
            });
        }

        res.json({
            success: true,
            status: 200,
            message: 'Assignments retrieved successfully',
            data: assignments
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};

module.exports = { assignTask, getAllAssignments };
