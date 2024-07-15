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
        salary:req.body.salary,
        experience:req.body.experience,
        gender:req.body.gender
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
  
Employee.findOne({_id:req.query.id})
.then((result)=>{
    if (!result) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Employee not found",
        });
      }
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

const update=(req,res)=>{
    let validation=""
    if(!req.body.id)
    validation="_id is required"
    if(!!validation)
    res.send({success:false,status:400,message:validation})
else
    Employee.findOne({_id:req.body.id})
    .then((result=>{
    if(result==null)
    res.json({

        success:false,
        status:400,
        message:"no employee found"
})
else
if(!!req.body.name)
result.name=req.body.name
if(!!req.body.email)
    result.email=req.body.email
if(!!req.body.phone)
    result.phone=req.body.phone
if(!!req.body.address)
    result.address=req.body.address
if(!!req.body.joining_date)
    result.joining_date=req.body.joining_date
if(!!req.body.salary)
    result.salary=req.body.salary
if(!!req.body.experience)
    result.experience=req.body.experience
if(!!req.body.gender)
    result.gender=req.body.gender


result.save()
.then(updateRes=>{
    res.json({
        success:true,
        status:200,
        message:"Employee Updated Successfully",
        data:updateRes
    })
})
.catch(error=>{
    res.json({
        success:false,
        status:400,
        message:error.message
    })
})
    }))

    .catch(error=>{
        res.json({
            success:false,
            status:400,
            message:error.message
        })
    })
}

const remove = (req, res) => {
    let validation = "";
    if (!req.body.id) {
        validation = "_id is required";
    }

    if (validation) {
        res.send({ success: false, status: 400, message: validation });
    } else {
        Employee.findOneAndDelete({ _id: req.body.id })
            .then((result) => {
                if (result == null) {
                    res.json({
                        success: false,
                        status: 400,
                        message: "No employee found"
                    });
                } else {
                    res.json({
                        success: true,
                        status: 200,
                        message: "Employee Deleted Successfully",
                        data: result
                    });
                }
            })
            .catch((error) => {
                res.json({
                    success: false,
                    status: 400,
                    message: error.message
                });
            });
    }
};



module.exports={
    addEmployee,getAll,getSingle,update,remove
}