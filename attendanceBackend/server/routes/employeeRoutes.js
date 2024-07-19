const express=require("express")
const router=express.Router()
const attendanceController=require("../apis/attendance/attendanceController")
const empRatingController=require("../apis/employeeRating/empRatingController")
const employeeController=require("../apis/employee/employeeController")

// attendance 
router.post("/attendance/add",attendanceController.addAttendance)
router.get("/attendance/single",attendanceController.getSingle)
router.post("/attendance/status",attendanceController.changeStatus)
router.get("/attendance/today",attendanceController.getTodayAttendance)
//rating
router.post("/rating/add",empRatingController.addRating)
router.get('/rating/getSingle/:employeeId', empRatingController.getSingle);

// login
router.post("/login",employeeController.employeeLogin)

module.exports=router