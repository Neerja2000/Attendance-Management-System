const express=require("express")
const router=express.Router()
const attendanceController=require("../apis/attendance/attendanceController")

router.post("/attendance/add",attendanceController.addAttendance)
module.exports=router