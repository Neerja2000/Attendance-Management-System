const express=require('express')
const router=express.Router()
const employeeController=require("../apis/employee/employeeController")
const attendanceController=require("../apis/attendance/attendanceController")
// Employee
router.post('/employee/add',employeeController.addEmployee)
router.get('/employee/getAll',employeeController.getAll)
router.get('/employee/getSingle',employeeController.getSingle)
router.put('/employee/update',employeeController.update)
router.delete('/employee/delete',employeeController.remove)

// attendance
router.get("/attendance/getAll",attendanceController.getAll)


module.exports=router