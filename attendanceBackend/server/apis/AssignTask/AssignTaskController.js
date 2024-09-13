const TaskAssignment = require('./AssignTaskModel');
const mongoose = require('mongoose');
const Task = require('../task/taskModel');
const Project = require('../project/projectModel');
const Employee=require("../employee/employeeModel")

// Assign Task to Project with Days
const assignTask = async (req, res) => {
    try {
        const { taskId, projectId } = req.body;
        const { employeeId } = req.params; // Extract employeeId from URL parameters
        let { assignedDays } = req.body;

        // Validate ObjectId formats
        if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Invalid task ID, project ID, or employee ID format',
            });
        }

        // Check if task, project, and employee exist
        const taskExists = await Task.findById(taskId);
        const projectExists = await Project.findById(projectId);
        const employeeExists = await Employee.findById(employeeId);

        if (!taskExists || !projectExists || !employeeExists) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Task, project, or employee not found',
            });
        }

        // Validate assignedDays array
        const allowedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const isValidDays = assignedDays.every(dayObj => {
            return allowedDays.includes(dayObj.day) && dayObj.date;
        });

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
            EmployeeId: new mongoose.Types.ObjectId(employeeId),
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


const getAllWeekTasksForEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        // Validate employeeId format
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Invalid employee ID format',
            });
        }

        // Check if employee exists
        const employeeExists = await Employee.findById(employeeId);
        if (!employeeExists) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Employee not found',
            });
        }

        // Get all tasks assigned to the employee for the week (Monday to Friday)
        const allowedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const tasks = await TaskAssignment.find({
            EmployeeId: new mongoose.Types.ObjectId(employeeId),
            assignedDays: { $in: allowedDays } // Check if assignedDays include any of the allowed days
        }).populate('taskId projectId'); // Populate task and project details

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'No tasks found for the employee for the week',
            });
        }

        res.json({
            success: true,
            status: 200,
            message: 'Tasks retrieved successfully',
            data: tasks
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};






module.exports = { assignTask,getAllWeekTasksForEmployee };
