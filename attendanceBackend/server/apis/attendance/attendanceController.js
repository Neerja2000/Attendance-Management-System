const attendance=require("./attendanceModel")
const addAttendance=async(req,res)=>{
    let total=await attendance.countDocuments()
    let newAttendance = new attendance({
        AttendanceId:total+1,
        check_in:req.body.check_in,
        break:req.body.break,
        check_out:req.body.check_out,
        work_done:req.body.work_done,
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
    attendance.findOne({_id:req.body.id}).populate('employeeId')
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

const changeStatus = (req, res) => {
    const { id, status } = req.body;
  
    // Validate status input
    if (!['absent', 'present', 'leave'].includes(status)) {
      return res.json({
        success: false,
        status: 400,
        message: "Invalid status value"
      });
    }
  
    attendance.findByIdAndUpdate(id, { status }, { new: true })
      .then((result) => {
        if (!result) {
          return res.json({
            success: false,
            status: 400,
            message: "Attendance Not Found"
          });
        }
        res.json({
          success: true,
          status: 200,
          message: "Status Changed",
          data: result
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          status: 410,
          message: err.message
        });
      });
  };

module.exports={addAttendance,getAll,getSingle,changeStatus}