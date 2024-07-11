const attendance=require("./attendanceModel")
const addAttendance=async(req,res)=>{
    let total=await attendance.countDocuments()
    let newAttendance = new attendance({
        AttendanceId:total+1,
        check_in:req.body.check_in,
        break:req.body.break,
        check_out:req.body.check_out,
        employeeId:req.body.employeeId
    })
    newAttendance.save()
    .then((result)=>{
        res.json({
            success:true,
            status:200,
            message:"Attendance Added Successfully",
            data:result
        })
    }).catch(err=>{
        res.json({
            success:false,
            status:400,
            message:err.message
        })
    })
}

const getAll=(req,res)=>{
    attendance.find().populate('employeeId')
    .then((result)=>{
        res.json({
            success:true,
            status:200,
            message:"Attendance Loaded Successfully",
            data:result
        })
    }).catch(err=>{
        res.json({
            success:false,
            status:400,
            message:err.message
        })
    })
}

const getSingle=(req,res)=>{
    attendance.findOne()
    .then((result)=>{
        res.json({
            success:true,
            status:200,
            message:"Attendance Loaded Successfully",
            data:result
        })
    }).catch(err=>{
        res.json({
            success:false,
            status:400,
            message:err.message
        })
    })
}

module.exports={addAttendance,getAll}