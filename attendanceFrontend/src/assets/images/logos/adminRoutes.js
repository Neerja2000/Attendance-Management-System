const express=require('express')
const router=express.Router()
const employeeController=require("../apis/employee/employeeController")
const attendanceController=require("../apis/attendance/attendanceController")

const empRatingController=require("../apis/employeeRating/empRatingController")
const adminController=require("../apis/admin/adminController")
const dailyRatingController=require("../apis/dailyRating/dailyRatingController")
const projectController=require("../apis/project/projectController")
const taskController=require("../apis/task/taskController")
const assignController = require('../apis/assignTask/AssignTaskController');

const upload = require('../config/multerconfig');


//adminLogin
router.post("/adminLogin",adminController.adminLogin)


//token
router.use(require("../MiddleWare/tokenChecker"))
router.post("/admin/password",adminController.adminUpdatePassword)


// Employee
router.post('/employee/add',employeeController.addEmployee)
router.get('/employee/getAll',employeeController.getAll)
router.get('/employee/getSingle',employeeController.getSingle)
router.put('/employee/update',employeeController.update)
router.delete('/employee/delete',employeeController.remove)

// attendance
router.get("/attendance/getAll",attendanceController.getAll)
router.get("/attendance/getEmployee",attendanceController.getEmployeeAttendance)
router.get("/attendance/today",attendanceController.getTodayAttendance)
router.get("/attendance/day",attendanceController.getAttendanceByDate)




// adminRating 
router.get("/emprating/getAll",empRatingController.getAll)
router.put("/adminrating/add",empRatingController.adminRating)

// view daily rating
router.get("/dailyRating/all",dailyRatingController.getDailyRatings)


router.post("/project/add", upload.array('files',5), projectController.addProject);
router.get("/project/getAll",projectController.getAll)
router.delete("/project/delete/:projectId",projectController.deleteProject)
router.get('/task/projectsbudget/:projectId',projectController.calculateProjectBudget);

router.post("/task/add", upload.array('files', 5), taskController.addTask);
router.get("/task/getAll",taskController.getAllTasks)
router.delete("/task/delete/:id", taskController.deleteTask);
router.post("/task/status/:taskId", taskController.changeTaskStatus);

//Task Assign
router.post('/assign-task/:employeeId',assignController.assignTask);
router.get('/assign-task/getAllWeekTasksForEmployee/:employeeId', assignController.getAllWeekTasksForEmployee);
router.patch('/approve-task-status/:id',assignController.approveTaskStatus);
router.post('/calculate-budget/:employeeId', assignController.calculateBudgetAndEmployeeCost);

router.post('/complete-task',assignController.completeTask);
router.post('/request-changes',assignController.requestChanges);
module.exports=router