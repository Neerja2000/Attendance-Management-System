const task =require("./taskModel")

const addTask = async (req, res) => {
    let total = await task.countDocuments();

    // Prepare file array, if files are uploaded
    let files = req.body.files ? req.body.files : [];
console.log("file",files)
    let newTask = new task({
        taskId: total + 1,
        projectId: req.body.projectId,
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription,
        expectedTime: req.body.expectedTime,
        file: files.length > 0 ? files : null // Store the array of file paths
    });

    newTask.save()
        .then((result) => {
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


module.exports={addTask}