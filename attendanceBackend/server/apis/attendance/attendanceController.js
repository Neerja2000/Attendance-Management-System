const attendance=require("./attendanceModel")
const Employee=require("../employee/employeeModel")
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


const getEmployeeAttendance = (req, res) => {
  const { id: employeeId } = req.query; // Read 'id' query parameter as 'employeeId'

  console.log('Fetching attendance for employeeId:', employeeId);

  attendance.find({ employeeId })
    .populate('employeeId') // Populate employee details if needed
    .then((results) => {
      console.log('Fetched attendance results:', results); // Log fetched results
      res.json({
        success: true,
        status: 200,
        message: "Employee Attendance Loaded Successfully",
        data: results
      });
    })
    .catch((err) => {
      console.error('Error fetching attendance:', err); // Log error if any
      res.json({
        success: false,
        status: 400,
        message: err.message
      });
    });
};




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


  const getTodayAttendance = async (req, res) => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));
  
      const pipeline = [
        {
          $lookup: {
            from: 'attendances',
            let: { empId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$employeeId', '$$empId'] },
                      { $gte: ['$createdAt', startOfDay] },
                      { $lte: ['$createdAt', endOfDay] }
                    ]
                  }
                }
              }
            ],
            as: 'attendances'
          }
        },
        {
          $addFields: {
            attendance: { $arrayElemAt: ['$attendances', 0] }
          }
        },
        {
          $project: {
            _id: 0,
            employeeId: '$_id',
            employeeName: '$name',
            check_in: '$attendance.check_in',
            break: '$attendance.break',
            check_out: '$attendance.check_out',
            work_done: '$attendance.work_done',
            status: '$attendance.status'
          }
        },
       
      ];
  
      const result = await Employee.aggregate(pipeline) ;
  
      res.json({
        success: true,
        status: 200,
        message: "Today's attendance loaded successfully",
        data: result
      });
  
    } catch (err) {
      res.json({
        success: false,
        status: 400,
        message: err.message
      });
    }
  };
  
  
  
  
  


module.exports={addAttendance,getAll,getSingle,changeStatus,getEmployeeAttendance,getTodayAttendance}