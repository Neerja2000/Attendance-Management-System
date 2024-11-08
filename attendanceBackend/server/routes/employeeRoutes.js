const express=require("express")
const router=express.Router()
const attendanceController=require("../apis/attendance/attendanceController")
const empRatingController=require("../apis/employeeRating/empRatingController")
const employeeController=require("../apis/employee/employeeController")
const dailyRatingController=require("../apis/dailyRating/dailyRatingController")
const projectController=require("../apis/project/projectController")
const assignController=require("../apis/AssignTask/AssignTaskController")
const announcementController=require("../apis/announcement/announcementController")


// login
router.post("/login",employeeController.employeeLogin)


//token
// router.use(require("../MiddleWare/tokenChecker"))
router.post("/employee/password",employeeController.employeeUpdatePassword)

// attendance 
router.post("/attendance/add",attendanceController.addAttendance)
router.get("/attendance/single",attendanceController.getSingle)
router.post("/attendance/status",attendanceController.changeStatus)
router.get('/attendance/today/:employeeId', attendanceController.getTodayAttendanceByEmployeeId);
router.get('/attendance/:employeeId/date', attendanceController.getAttendanceByEmployeeIdAndDate);

//rating
router.post("/rating/add",empRatingController.addRating)

router.get('/rating/getSingle/:employeeId', empRatingController.getSingle);
// daily
router.post("/dailyRating/add",dailyRatingController.addDailyRating)
router.get("/dailyRating/getSingle/:employeeId",dailyRatingController.getSingleEmployeeRating)


router.get('/getProjectsByEmployee/:employeeId',projectController.getProjectsByEmployee)


// change status
router.patch('/task-status/:id',assignController.updateTaskStatus);

// dashboard
router.get('/dashboard/getholidays/:employeeId',attendanceController.getHolidaysByMonth)
router.get('/dashboard/pending-tasks/:employeeId', assignController.getPendingTasksCount);
// 
router.get('/announcements/get',announcementController.getAnnouncements)

router.post('/announcements/likes/:announcementId',announcementController.addLike)
router.post('/announcements/comments/:announcementId',announcementController.addComment)
router.get('/attendence/late-arrivals/:employeeId',attendanceController.getLateArrivalsByMonth);
module.exports=router