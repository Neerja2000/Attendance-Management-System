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
            'assignedDays.day': { $in: allowedDays } // Check if any assigned day matches the allowed days
        })
        .populate('taskId')  // Populate task details
        .populate('projectId'); // Populate project details

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

const updateTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.id; // Extract TaskAssignment ID from URL parameters
        const { status } = req.body; // Extract new status from the request body

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Invalid task assignment ID format',
            });
        }

        // Validate status value
        const allowedStatuses = ['pending', 'started', 'waiting for approval', 'Under Revision: Approval Pending', 'under revision'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Invalid status value',
            });
        }

        // Fetch the current task assignment
        const currentAssignment = await TaskAssignment.findById(taskId);
        if (!currentAssignment) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Task assignment not found',
            });
        }

        // Prevent status changes after it becomes "waiting for approval"
        if (currentAssignment.status === 'completed') {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Task is already completed and cannot be updated further',
            });
        }

        // If task is already "waiting for approval", prevent any further changes by the user
        if ((currentAssignment.status === 'waiting for approval' || currentAssignment.status === 'Under Revision: Approval Pending') && status !== 'completed') {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Task is waiting for approval and cannot be updated by the user',
            });
        }

        // Determine if we need to increment the revision count
        let updateData = { status };
        if (status === 'under revision' || currentAssignment.status === 'Under Revision: Approval Pending') {
            updateData.revisionCount = (currentAssignment.revisionCount || 0) + 1; // Increment revisionCount
        }

        // Find and update the task assignment status
        const updatedAssignment = await TaskAssignment.findByIdAndUpdate(
            taskId,
            updateData,
            { new: true } // Return the updated document
        );

        res.json({
            success: true,
            status: 200,
            message: 'Task assignment status updated successfully',
            data: updatedAssignment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message,
        });
    }
};

const approveTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Invalid task assignment ID format',
            });
        }

        // Fetch the current task assignment
        const currentAssignment = await TaskAssignment.findById(taskId);
        if (!currentAssignment) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Task assignment not found',
            });
        }

        // Only allow the admin to approve tasks in "waiting for approval"
        if (currentAssignment.status !== 'waiting for approval') {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Task is not waiting for approval',
            });
        }

        // Update status to "completed"
        currentAssignment.status = 'completed';
        await currentAssignment.save();

        res.json({
            success: true,
            status: 200,
            message: 'Task has been approved and marked as completed',
            data: currentAssignment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message,
        });
    }
};


const completeTask = async (req, res) => {
    try {
      const { taskId, rating, review } = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'Invalid task ID format',
        });
      }
  
      // Find and update the task assignment with the rating and review
      const updatedTask = await TaskAssignment.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(taskId) }, // Use `_id` for the find query
        { rating, review, status: 'completed' }, // Update status to 'completed' and store review
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'Task assignment not found',
        });
      }
  
      res.json({
        success: true,
        status: 200,
        message: 'Task completed, rated, and reviewed successfully',
        data: updatedTask,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        status: 500,
        message: err.message,
      });
    }
  };
  

const requestChanges = async (req, res) => {
    try {
        const { taskId, feedback } = req.body;

        // Validate taskId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Invalid task ID format',
            });
        }

        // Find the task assignment
        const currentAssignment = await TaskAssignment.findById(taskId);
        if (!currentAssignment) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Task assignment not found',
            });
        }

        // Ensure feedback is an array
        currentAssignment.feedback = currentAssignment.feedback || []; // Initialize if undefined
        if (!Array.isArray(currentAssignment.feedback)) {
            return res.status(500).json({
                success: false,
                status: 500,
                message: 'Feedback field must be an array.',
            });
        }

        // Update feedback and increment revision count
        currentAssignment.feedback.push(...feedback); // Spread the feedback array
        currentAssignment.revisionCount += 1; // Increment revision count
        currentAssignment.status = 'under revision'; // Set status to under revision

        // Save the updated assignment
        const updatedTask = await currentAssignment.save();

        res.json({
            success: true,
            status: 200,
            message: 'Request for changes received successfully',
            data: updatedTask,
        });
    } catch (err) {
        console.error('Error in requestChanges:', err);
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Internal server error',
            error: err.message,
        });
    }
};






module.exports = { assignTask,getAllWeekTasksForEmployee,updateTaskStatus,approveTaskStatus,completeTask,requestChanges };
