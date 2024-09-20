const project = require("./projectModel");
const TaskModel = require('../task/taskModel');
const mongoose = require('mongoose');

const addProject = async (req, res) => {
    try {
    

        // Parse employeeIds string into array if needed
        const employeeIds = typeof req.body.employeeIds === 'string' ? JSON.parse(req.body.employeeIds) : req.body.employeeIds;
        console.log('Parsed Employee IDs:', employeeIds);

        const { projectName, projectDescription, projectBudget } = req.body;  // Add projectBudget to destructuring
        const files = req.files ? req.files.map(file => file.filename) : []; 

        // Convert employeeIds to ObjectId array, handle invalid ObjectId format
        const employeeIdArray = Array.isArray(employeeIds)
            ? employeeIds.map(id => {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    throw new Error(`Invalid employee ID format: ${id}`);
                }
                return new mongoose.Types.ObjectId(id);
            })
            : [];

        // Ensure projectBudget is provided and is a valid number
        if (!projectBudget || isNaN(projectBudget)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid or missing project budget"
            });
        }

        let total = await project.countDocuments();  // Count the total projects

        // Create the new project document
        let newProject = new project({
            projectId: total + 1,
            employeeIds: employeeIdArray,
            projectName,
            projectDescription,
            projectBudget: parseFloat(projectBudget),  // Save projectBudget as a number
            files: files.length > 0 ? files : []  // Save file names if any are uploaded
        });

        const result = await newProject.save();  // Save the project to the database

        return res.json({
            success: true,
            status: 200,
            message: "Project added successfully",
            data: result
        });
    } catch (err) {
        console.error('Error in addProject:', err);  // Log the error for debugging

        return res.status(400).json({
            success: false,
            status: 400,
            message: err.message  // Send error message to the client
        });
    }
};


const getAll = async (req, res) => {
    try {
        const projects = await project.find(); 

        // Create URLs for the files
        const projectsWithFileUrls = projects.map(project => {
            return {
                ...project._doc,
                files: project.files.map(file => `http://localhost:3000/projectDocument/${file}`)

            };
        });

        res.json({
            success: true,
            status: 200,
            message: "Projects retrieved successfully",
            data: projectsWithFileUrls
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params; // Get projectId from request params

        // Find the project by projectId and delete it
        const deletedProject = await project.findOneAndDelete({ projectId });

        if (!deletedProject) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Project not found"
            });
        }

        res.json({
            success: true,
            status: 200,
            message: "Project deleted successfully",
            data: deletedProject
        });
    } catch (err) {
        console.error('Error in deleteProject:', err);  // Log the error for debugging

        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};


const getProjectsByEmployee = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid employee ID format"
            });
        }

        const projects = await project.find({ employeeIds: employeeId });

        if (!projects || projects.length === 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "No projects found for the employee"
            });
        }

        const projectsWithFileUrls = projects.map(proj => ({
            ...proj._doc,
            files: proj.files.map(file => `http://localhost:3000/projectDocument/${file}`)
        }));

        res.json({
            success: true,
            status: 200,
            message: "Projects retrieved successfully",
            data: projectsWithFileUrls
        });
    } catch (err) {
        console.error('Error in getProjectsByEmployee:', err);

        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};

const calculateProjectBudget = async (req, res) => {
    try {
      const projectId = req.params.projectId;
  
      // Fetch the project by ID and populate tasks and employees
      const projectData = await project.findById(projectId).populate('employeeIds');
      if (!projectData) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const projectBudget = projectData.projectBudget;
      let totalEmployeeCost = 0;
  
      // Fetch all tasks for the project
      const tasks = await TaskModel.find({ projectId });
  
      // Iterate over each task in the project
      for (const task of tasks) {
        let taskEmployeeCost = 0;
  
        for (const employee of projectData.employeeIds) {
          const taskDuration = convertExpectedTimeToHours(task.expectedTime);
          const employeeCostForTask = employee.perHourSalary * taskDuration;
          taskEmployeeCost += employeeCostForTask; 
        }
  
        totalEmployeeCost += taskEmployeeCost;
  
        // Update the TotalProjectBudgets field for the task with its individual cost
        await TaskModel.findByIdAndUpdate(task._id, { TotalProjectBudgets: taskEmployeeCost });
      }
  
      // Calculate remaining budget and budget status
      const remainingBudget = projectBudget - totalEmployeeCost;
      const budgetStatus = remainingBudget >= 0 ? 'positive' : 'negative';
  
      // Update the Project model with TotalProjectBudgets and RemainingBudget
      await project.findByIdAndUpdate(projectId, {
        TotalProjectBudgets: totalEmployeeCost,
        RemainingBudget: remainingBudget,  // Update this field to store the remaining budget
      });
  
      // Send the response with the calculated values
      res.status(200).json({
        success: true,
        projectBudget,
        totalEmployeeCost,
        remainingBudget,
        status: budgetStatus,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Helper function to convert 'expectedTime' to hours
  const convertExpectedTimeToHours = (expectedTime) => {
    const [days, hours, minutes] = expectedTime.split(' ').map(str => parseInt(str));
    const totalHours = (days || 0) * 24 + (hours || 0) + (minutes || 0) / 60;
    return totalHours;
  };
  
  
  

module.exports = { addProject, getAll,deleteProject,getProjectsByEmployee,calculateProjectBudget };
