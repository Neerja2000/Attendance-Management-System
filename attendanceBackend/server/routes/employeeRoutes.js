const express=require("express")
const router=express.Router()
const attendanceController=require("../apis/attendance/attendanceController")


// attendance 
router.post("/attendance/add",attendanceController.addAttendance)
router.get("/attendance/single",attendanceController.getSingle)
router.post("/attendance/status",attendanceController.changeStatus)
module.exports=router