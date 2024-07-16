const express=require("express")
const router=express.Router()
const attendanceController=require("../apis/attendance/attendanceController")
const empRatingController=require("../apis/employeeRating/empController")


// attendance 
router.post("/attendance/add",attendanceController.addAttendance)
router.get("/attendance/single",attendanceController.getSingle)
router.post("/attendance/status",attendanceController.changeStatus)

//rating
router.post("/rating/add",empRatingController.addRating)
module.exports=router