const project = require("./projectModel");

const addProject = async (req, res) => {
    try {
        // Extract the data from req.body
        const {
            employeeId,
            projectName,
            projectDescription,
            employeeNames,
            document,
           
        } = req.body;

        // Get the total count of documents to assign a projectId
        let total = await project.countDocuments();

        // Create a new project instance based on the extracted fields
        let newProject = new project({
            projectId: total + 1,  // Increment projectId by the total number of documents
            employeeId,            // Employee assigned to the project
            projectName,           // Project name
            projectDescription,
            employeeNames,    // Project description
            document,              // Document associated with the project
            
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
