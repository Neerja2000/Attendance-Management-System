const task = require("./taskModel");

const addTask = async (req, res) => {
    let total = await task.countDocuments();

    // Prepare file array if files are uploaded
    const files = req.files ? req.files.map(file => file.filename) : []; // Handle multiple files

    let newTask = new task({
        taskId: total + 1,
        projectId: req.body.projectId,
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription,
        expectedTime: req.body.expectedTime,
        files: files.length > 0 ? files : [] // Store the array of file paths
    });

    newTask.save()
        .then(result => {
            res.json({
                success: true,
                status: 200,
                message: "New task added",
                data: result
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                message: err.message
            });
        });
};



const getAllTasks = async (req, res) => {
    try {
        const projectId = req.query.projectId; // Use req.query for query parameters
       

        if (!projectId) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Project ID is required"
            });
        }

        const tasks = await task.find({ projectId });

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "No tasks found for this project"
            });
        }

        res.json({
            success: true,
            status: 200,
            message: "Tasks retrieved successfully",
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


module.exports = { addTask ,getAllTasks};
