const express=require('express')
const router=express.router()
const addEmployeeController=require("../apis/employee/employeeController")

router.post('/employee/add',addEmployeeController.addEmployee)



module.exports=router