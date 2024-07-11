const express=require('express')
const router=express.Router()
const addEmployeeController=require("../apis/employee/employeeController")

router.post('/employee/add',addEmployeeController.addEmployee)
router.get('/employee/getAll',addEmployeeController.getAll)


module.exports=router