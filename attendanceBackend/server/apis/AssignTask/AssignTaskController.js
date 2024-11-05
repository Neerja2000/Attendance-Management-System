const TaskAssignment = require('./AssignTaskModel');
const mongoose = require('mongoose');
const Task = require('../task/taskModel');
const Project = require('../project/projectModel');
const Employee=require("../employee/employeeModel")

// Assign Task to Project with Days
const assignTask = async (req, res) => {
    try {
        const { taskId, projectId, urgent = false, assignedDays } = req.body;
        const { employeeId } = req.params; // Extract employeeId from URL parameters

        console.log('Received taskId:', taskId);
        console.log('Received projectId:', projectId);
        console.log('Received employeeId:', employeeId);

        // Validate ObjectId formats
        if (!mongoose.Types.ObjectId.isValid(taskId) || 
            !mongoose.Types.ObjectId.isValid(projectId) || 
            !mongoose.Types.ObjectId.isValid(employeeId)) {
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

        console.log('Task Exists:', taskExists);
        console.log('Project Exists:', projectExists);
        console.log('Employee Exists:', employeeExists);

        if (!taskExists || !projectExists || !employeeExists) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Task, project, or employee not found',
            });
        }

        // Log assignedDays
        console.log('Assigned Days:', assignedDays);
        
        // Check if assignedDays is an array
        if (!Array.isArray(assignedDays)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'assignedDays must be an array',
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
            assignedDays,
            urgent // Include the urgent field
        });

        const result = await newAssignment.save();

        res.json({
            success: true,
            status: 200,
            message: 'Task assigned successfully',
            data: result
        });
    } catch (err) {
        console.error('Error:', err); // Log the error for debugging
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

const parseExpectedTime = (expectedTime) => {
    const daysMatch = expectedTime.match(/(\d+)\s*days?/);
    const hoursMatch = expectedTime.match(/(\d+)\s*hours?/);
    const minutesMatch = expectedTime.match(/(\d+)\s*min/);

    const days = daysMatch ? parseInt(daysMatch[1], 10) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    const totalHours = (days * 24) + hours + (minutes / 60);
    return totalHours;
};

const calculateBudgetAndEmployeeCost = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { projectId, taskId } = req.body;

        // Validate IDs
        if (
            !mongoose.Types.ObjectId.isValid(projectId) ||
            !mongoose.Types.ObjectId.isValid(taskId) ||
            !mongoose.Types.ObjectId.isValid(employeeId)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project, task, or employee ID format',
            });
        }

        // Fetch the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        // Validate project budget is a valid number
        if (isNaN(project.projectBudget) || project.projectBudget == null) {
            return res.status(400).json({
                success: false,
                message: 'Project budget is invalid or not a number',
            });
        }

        // Fetch employee details for hourly rate
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
            });
        }

        // Fetch task details
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Find task assignment
        const taskAssignment = await TaskAssignment.findOne({
            taskId: new mongoose.Types.ObjectId(taskId),
            projectId: new mongoose.Types.ObjectId(projectId),
            EmployeeId: new mongoose.Types.ObjectId(employeeId),
        });
        if (!taskAssignment) {
            return res.status(404).json({
                success: false,
                message: 'Task assignment not found',
            });
        }

        // Parse the expected time (use your existing parse function)
        const assignedHours = parseExpectedTime(task.expectedTime);
        if (isNaN(assignedHours) || assignedHours <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Expected time is invalid or cannot be parsed',
            });
        }

        // Calculate the employee cost based on hourly rate
        const employeeCost = assignedHours * employee.perHourSalary;
        const pendingBudget=project.RemainingBudget;
        // Calculate remaining budget after the new employee cost
        const remainingBudget = project.RemainingBudget - employeeCost;
        console.log(remainingBudget)
        // Update the project model with the new remaining budget
        if (remainingBudget < 0) {
            return res.status(400).json({
                success: false,
                message: 'Not enough budget to assign this task to the employee',
            });
        }

        project.RemainingBudget = remainingBudget; // Update remaining budget
        await project.save(); // Save the updated project

        // Update the task assignment with calculated employee cost
        taskAssignment.employeeCost = employeeCost;
        await taskAssignment.save();

        res.json({
            success: true,
            project: projectId,
            projectBudget:project.projectBudget,
            employee: employeeId,
            task: taskId,
            assignedHours,
            hourlyRate: employee.perHourSalary,
            pendingBudget,
            employeeCost,
            remainingBudget,
            message: 'Remaining budget and employee cost calculated successfully',
        });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error calculating budget and employee cost',
            error: err.message,
        });
    }
};

const getPendingTasksCount = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { month } = req.query; // Get month from query params
  
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
  
      // If no month is provided, default to the current month
      let selectedMonth = month;
      if (!selectedMonth) {
        const currentDate = new Date();
        selectedMonth = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}`;
      }
  
      // Extract year and month from the selected month parameter (format: YYYY-MM)
      const [year, monthIndex] = selectedMonth.split('-');
      if (!year || !monthIndex || isNaN(year) || isNaN(monthIndex)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'Invalid month format (expected YYYY-MM)',
        });
      }
  
      // Generate the start and end dates for the selected month (in UTC)
      const startDate = new Date(Date.UTC(year, monthIndex - 1, 1)); // Start of the month
      const endDate = new Date(Date.UTC(year, monthIndex, 0, 23, 59, 59)); // End of the month
  
      console.log("Year:", year);
      console.log("Month Index:", monthIndex);
      console.log("Start Date:", startDate.toISOString());
      console.log("End Date:", endDate.toISOString());
  
      // Count pending tasks for the employee within the specified month
      const pendingTasksCount = await TaskAssignment.countDocuments({
        EmployeeId: new mongoose.Types.ObjectId(employeeId),
        status: 'pending',
        createdAt: { $gte: startDate, $lte: endDate } // Filter by createdAt date range
      });
  
      res.json({
        success: true,
        status: 200,
        message: 'Pending tasks count retrieved successfully',
        data: { pendingTasksCount },
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({
        success: false,
        status: 500,
        message: err.message,
      });
    }
  };
  
  const getTasksCountByDate = async (req, res) => {
    try {
        const { date } = req.query;
        console.log('Query date:', date); // Log the query date for debugging
        
        const tasksCount = await TaskAssignment.aggregate([
            { 
                $match: { 
                    'assignedDays.date': date 
                } 
            },
            {
                $group: {
                    _id: '$status', // Group by task status
                    count: { $sum: 1 } // Count the number of tasks per status
                }
            }
        ]);
        
        // Prepare counts for pending and completed tasks
        const pendingCount = tasksCount.find(task => task._id === 'pending')?.count || 0;
        const completedCount = tasksCount.find(task => task._id === 'completed')?.count || 0;

        console.log('Tasks found:', tasksCount); // Log tasks to inspect
        res.json({
            success: true,
            count: {
                total: pendingCount + completedCount,
                pending: pendingCount,
                completed: completedCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};





module.exports = { assignTask,getAllWeekTasksForEmployee,updateTaskStatus,approveTaskStatus,completeTask,requestChanges,calculateBudgetAndEmployeeCost ,getPendingTasksCount,getTasksCountByDate};
