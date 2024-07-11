const express=require('express')
const router=express.Router()
const employeeController=require("../apis/employee/employeeController")

router.post('/employee/add',employeeController.addEmployee)
router.get('/employee/getAll',employeeController.getAll)
router.get('/employee/getSingle',employeeController.getSingle)
router.put('/employee/update',employeeController.update)
router.delete('/employee/delete',employeeController.remove)
module.exports=router