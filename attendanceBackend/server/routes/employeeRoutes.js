const express=require("express")
const router=express.Router()
const attendanceController=require("../apis/attendance/attendanceController")
const empRatingController=require("../apis/employeeRating/empRatingController")
const employeeController=require("../apis/employee/employeeController")
const dailyRatingController=require("../apis/dailyRating/dailyRatingController")


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
//rating
router.post("/rating/add",empRatingController.addRating)

router.get('/rating/getSingle/:employeeId', empRatingController.getSingle);
// daily
router.post("/dailyRating/add",dailyRatingController.addDailyRating)
router.get("/dailyRating/getSingle/:employeeId",dailyRatingController.getSingleEmployeeRating)

module.exports=router