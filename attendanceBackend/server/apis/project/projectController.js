const project = require("./projectModel");
const mongoose = require('mongoose');

const addProject = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body
        console.log('Uploaded Files:', req.files); // Log the uploaded files

        const employeeIds = typeof req.body.employeeIds === 'string' ? JSON.parse(req.body.employeeIds) : req.body.employeeIds;
        console.log('Parsed Employee IDs:', employeeIds);

        const { projectName, projectDescription } = req.body;
        const files = req.files ? req.files.map(file => file.filename) : []; 

        const employeeIdArray = Array.isArray(employeeIds)
            ? employeeIds.map(id => new mongoose.Types.ObjectId(id))
            : [];

        let total = await project.countDocuments();

        let newProject = new project({
            projectId: total + 1,
            employeeIds: employeeIdArray,
            projectName,
            projectDescription,
            files: files.length > 0 ? files : []
        });

        const result = await newProject.save();

        return res.json({
            success: true,
            status: 200,
            message: "Project added successfully",
            data: result
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: err.message
        });
    }
};

const getAll = async (req, res) => {
    try {
        // Retrieve all tasks from the database
        const projects = await project.find(); // This assumes you're using Mongoose and Task is your model

        res.json({
            success: true,
            status: 200,
            message: "projects retrieved successfully",
            data: projects
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};




module.exports = { addProject,getAll };
