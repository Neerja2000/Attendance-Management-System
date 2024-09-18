const task = require("./taskModel");

const addTask = async (req, res) => {
    let total = await task.countDocuments();

    // Prepare file array if files are uploaded
    const files = req.files ? req.files.map(file => file.filename) : []; // Handle multiple files

    let newTask = new task({
        taskId: total + 1,
        projectId: req.body.projectId,
        taskName: req.body.taskName,
        description: req.body.description,
        expectedTime: req.body.expectedTime,
        files: files.length > 0 ? files : [] // Store the array of file paths
    });

    newTask.save()
        .then(result => {
            console.log("result",result)
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
      const projectId = req.query.projectId;
  
      if (!projectId) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Project ID is required"
        });
      }
  
      const tasks = await task.find({ projectId });
  
      // Create URLs for the files
      const projectsWithFileUrls = tasks.map(task => {
        return {
          ...task._doc,
          files: task.files.map(file => `http://localhost:3000/projectDocument/${file}`)
        };
      });
  
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


  const deleteTask = async (req, res) => {
    try {
      const taskId = req.params.id;
  
      // Find and delete the task by _id
      const deletedTask = await task.findByIdAndDelete(taskId);
  
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the task', error });
    }
};


const changeTaskStatus = async (req, res) => {
  try {
    console.log("stats", req.body);
    const taskId = req.params.taskId;
    const newStatus = req.body.status;

    // Validate the status: specifically check for undefined or null, not falsy values like false
    if (newStatus === undefined || newStatus === null) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Status is required",
      });
    }

    // Find the task by ID and update the status
    const updatedTask = await task.findByIdAndUpdate(
      taskId,
      { status: newStatus },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "An error occurred while updating the task status",
      error: error.message,
    });
  }
};


module.exports = { addTask ,getAllTasks,deleteTask,changeTaskStatus};
