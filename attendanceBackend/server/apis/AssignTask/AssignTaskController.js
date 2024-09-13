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

        // Handle both string and array for assignedDays
        if (typeof assignedDays === 'string') {
            assignedDays = [assignedDays]; // Convert to array if it's a string
        }

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





// Get All Assignments
const getAllAssignments = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        console.log("employeeId",employeeId)
        // Fetch assigned tasks from the database
        const assignments = await TaskAssignment.find({ employeeId: employeeId });
    
        if (assignments.length > 0) {
          res.json({
            success: true,
            assignments: assignments
          });
        } else {
          res.json({
            success: false,
            message: 'No assignments found'
          });
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({
          success: false,
          message: 'Server error'
        });
      }
};

module.exports = { assignTask, getAllAssignments };
