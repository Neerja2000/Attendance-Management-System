const Employee = require('./employeeModel');

const addEmployee=async(req,res)=>{
    let total=await Employee.countDocuments()
    let newEmployee=new Employee({
        employeeId:total+1,
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        joining_date:req.body.joining_date,
        salary:req.body.salary
    })
    newEmployee.save()
    .then((result)=>{
        res.json({
            success:true,
            status:200,
            message:"employee added successfully",
            data:result
        })
    })
    .catch((err)=>{
        res.json({
            success:false,
            status:400,
            message:err
          
        })
    })
}

const getAll=(req,res)=>{
    Employee.find()
    .then((result)=>{
        res.json({
            success:true,
            status:200,
            message:"Get All Employees",
            data:result
        })
    })
    .catch((err)=>{
        res.json({
            success:false,
            status:400,
            message:err
        })
    })
}
const getSingle=(req,res)=>{
  
Employee.findOne({_id:req.body.id})
.then((result)=>{
    res.json({
        success:true,
        status:200,
        message:" Single Employee Loaded",
        data:result
    })
})
.catch((err)=>{
    res.json({
        success:false,
        status:400,
        message:err
    })
})
}



module.exports={
    addEmployee,getAll,getSingle
}