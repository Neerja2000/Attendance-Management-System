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
            projectBudget: parseFloat(projectBudget),
            RemainingBudget:parseFloat(projectBudget),  // Save projectBudget as a number
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


const getSingleProject = async (req, res) => {
    try {
        const projectId = req.params.projectId; // Correctly extract projectId

        // Find the project by projectId or _id, depending on your schema
        const projectData = await project.findOne({ _id: projectId }).populate('employeeIds');

        // If the project doesn't exist, return an error
        if (!projectData) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Project not found"
            });
        }

        // Construct the file URLs
        const projectWithFileUrls = {
            ...projectData._doc,
            files: projectData.files.map(file => `http://localhost:3000/projectDocument/${file}`),
            employeeNames: projectData.employeeIds.map(employee => employee.name).join(', ') // List of employee names
        };

        // Return the project with file URLs
        return res.json({
            success: true,
            status: 200,
            message: "Project retrieved successfully",
            data: projectWithFileUrls
        });
    } catch (err) {
        console.error('Error in getSingleProject:', err);

        return res.status(500).json({
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


const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { projectName, projectDescription, projectBudget } = req.body;

        // Log the entire request body to see all the received data
        console.log("Request Body:", req.body);
        console.log("Project Name:", projectName);
        console.log("Project Description:", projectDescription);
        console.log("Project Budget (raw):", projectBudget);
        console.log("Employee IDs (raw):", req.body.employeeIds);

        // Parse employeeIds from req.body
        const employeeIdArray = req.body.employeeIds ? JSON.parse(req.body.employeeIds) : [];

        // Log the parsed employee IDs array
        console.log("Parsed Employee IDs Array:", employeeIdArray);

        // Validate employee IDs and convert to ObjectId
        const employeeIdArrayFormatted = Array.isArray(employeeIdArray)
            ? employeeIdArray.map(id => {
                console.log("Converting ID:", id);
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    throw new Error(`Invalid employee ID format: ${id}`);
                }
                return new mongoose.Types.ObjectId(id); // Use 'new' keyword here
            })
            : [];

        // Ensure projectBudget is provided and valid
        if (!projectBudget || isNaN(projectBudget)) {
            console.error("Validation Error: Invalid or missing project budget");
            return res.status(400).json({
                success: false,
                message: "Invalid or missing project budget"
            });
        }

        // Handle file uploads (if new files are uploaded)
        const files = req.files ? req.files.map(file => file.filename) : [];

        const updatedProject = await project.findByIdAndUpdate(
            projectId,
            {
                projectName,
                projectDescription,
                projectBudget: parseFloat(projectBudget),
                RemainingBudget: parseFloat(projectBudget),
                employeeIds: employeeIdArrayFormatted,
                $push: { files: { $each: files } }
            },
            { new: true, runValidators: true }
        ).populate('employeeIds');

        if (!updatedProject) {
            console.error("Error: Project not found for ID", projectId);
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const projectWithFileUrls = {
            ...updatedProject._doc,
            files: updatedProject.files.map(file => `http://localhost:3000/projectDocument/${file}`),
            employeeNames: updatedProject.employeeIds.map(employee => employee.name).join(', ')
        };

        return res.json({
            success: true,
            message: "Project updated successfully",
            data: projectWithFileUrls
        });
    } catch (err) {
        console.error('Error in updateProject:', err.message, err.stack);

        return res.status(500).json({
            success: false,
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


  
  
  

module.exports = { addProject, getAll,deleteProject,getProjectsByEmployee,getSingleProject,updateProject };
