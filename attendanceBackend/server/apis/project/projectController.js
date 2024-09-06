const project = require("./projectModel");
const mongoose = require('mongoose');

const addProject = async (req, res) => {
    try {
        // Extract the data from req.body
        console.log('Request Body:', req.body); // Add logging to check the incoming data

        // Parse employeeIds if they come as a string
        const employeeIds = typeof req.body.employeeIds === 'string' ? JSON.parse(req.body.employeeIds) : req.body.employeeIds;
        console.log('Parsed Employee IDs:', employeeIds); // Log parsed employeeIds

        const { projectName, projectDescription } = req.body;
        const document = req.file ? req.file.filename : null;

        // Ensure employeeIds is an array and map it to ObjectId
        const employeeIdArray = Array.isArray(employeeIds)
            ? employeeIds.map(id => new mongoose.Types.ObjectId(id))
            : []; // Ensure it's an array of ObjectId

        let total = await project.countDocuments();

        // Create a new project instance based on the extracted fields
        let newProject = new project({
            projectId: total + 1,  // Increment projectId by the total number of documents
            employeeIds: employeeIdArray,  // Assign multiple employees
            projectName,           // Project name
            projectDescription,    // Project description
            document               // Document associated with the project
        });

        // Save the new project to the database
        const result = await newProject.save();

        // Return success response
        return res.json({
            success: true,
            status: 200,
            message: "Project added successfully",
            data: result
        });
    } catch (err) {
        // Handle errors and return failure response
        return res.status(400).json({
            success: false,
            status: 400,
            message: err.message
        });
    }
};



module.exports = { addProject };
