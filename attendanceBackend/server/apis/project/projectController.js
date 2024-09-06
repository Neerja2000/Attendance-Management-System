const project = require("./projectModel");
const mongoose = require('mongoose');

const addProject = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body
        console.log('Uploaded Files:', req.files); // Log the uploaded files

        // Parse employeeIds string into array if needed
        const employeeIds = typeof req.body.employeeIds === 'string' ? JSON.parse(req.body.employeeIds) : req.body.employeeIds;
        console.log('Parsed Employee IDs:', employeeIds);

        const { projectName, projectDescription } = req.body;
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

        let total = await project.countDocuments();  // Count the total projects

        // Create the new project document
        let newProject = new project({
            projectId: total + 1,
            employeeIds: employeeIdArray,
            projectName,
            projectDescription,
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
        // Retrieve all projects from the database
        const projects = await project.find(); 

        res.json({
            success: true,
            status: 200,
            message: "Projects retrieved successfully",
            data: projects
        });
    } catch (err) {
        console.error('Error in getAll:', err);  // Log the error for debugging

        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};

module.exports = { addProject, getAll };
