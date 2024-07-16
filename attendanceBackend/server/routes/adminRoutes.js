const express=require('express')
const router=express.Router()
const employeeController=require("../apis/employee/employeeController")
const attendanceController=require("../apis/attendance/attendanceController")
const ratingController=require("../apis/rating/ratingController")
const empRatingController=require("../apis/employeeRating/empController")
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


// rating
router.post("/rating/add",ratingController.addRating)

// empRating view
router.post("/emprating/getAll",empRatingController.getAll)
module.exports=router