const attendance=require("./attendanceModel")
const Employee=require("../employee/employeeModel")
const mongoose = require('mongoose');

const addAttendance = async (req, res) => {
  try {
    const { employeeId, check_in, break_time_start,break_time_finish, check_out, work_done } = req.body;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Find existing attendance for the same user on the same day
    const existingAttendance = await attendance.findOne({
      employeeId: employeeId,
      createdAt: { $gte: new Date(today), $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000) }
    });

    if (existingAttendance) {
      // Update existing attendance record with partial updates
      if (check_in) existingAttendance.check_in = check_in;
      if (break_time_start) existingAttendance.break_time_start = break_time_start;
      if (break_time_finish) existingAttendance.break_time_finish = break_time_finish;
      if (check_out) existingAttendance.check_out = check_out;
      if (work_done) existingAttendance.work_done = work_done;

      const result = await existingAttendance.save();
      return res.json({
        success: true,
        status: 200,
        message: "Attendance Updated Successfully",
        data: result
      });
    } else {
      // Create new attendance record
      let total = await attendance.countDocuments();
      let newAttendance = new attendance({
        AttendanceId: total + 1,
        check_in: check_in,
        break_time_start: break_time_start,
        break_time_finish:break_time_finish,
        check_out: check_out,
        work_done: work_done,
        employeeId: employeeId
      });

      const result = await newAttendance.save();
      return res.json({
        success: true,
        status: 200,
        message: "Attendance Added Successfully",
        data: result
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};



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
  const { id: employeeId } = req.query; 

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
            break_time_start: '$attendance.break_time_start',
            break_time_finish: '$attendance.break_time_finish',
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
  
  const getTodayAttendanceByEmployeeId = async (req, res) => {
    try {
      const { employeeId } = req.params;
  
      // Validate if employeeId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ success: false, status: 400, message: 'Invalid Employee ID format' });
      }
  
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));
  
      // Log Employee ID and Date range for debugging
      console.log("Employee ID:", employeeId);
      console.log("Start of Day:", startOfDay);
      console.log("End of Day:", endOfDay);
  
      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(employeeId)  // Cast employeeId to ObjectId if necessary
          }
        },
        {
          $lookup: {
            from: 'attendances',
            let: { empId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$employeeId', '$$empId'] }, // Ensure employeeId matches
                      { $gte: ['$createdAt', startOfDay] }, // Check within today's range
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
            break_time_start: '$attendance.break_time_start',
            break_time_finish: '$attendance.break_time_finish',
            check_out: '$attendance.check_out',
            work_done: '$attendance.work_done',
            status: '$attendance.status'
          }
        }
      ];
  
      console.log("Pipeline:", JSON.stringify(pipeline, null, 2));  // Log the pipeline
      const result = await Employee.aggregate(pipeline);
  
      if (result.length === 0) {
        return res.status(404).json({ success: false, status: 404, message: "No attendance records found for today." });
      }
  
      res.json({ success: true, status: 200, message: "Today's attendance loaded successfully", data: result });
    } catch (err) {
      console.error('Error:', err);  // Log the error details
      res.status(500).json({ success: false, status: 500, message: 'Internal Server Error' });
    }
  };
  

  
  
  const getAttendanceByDate = async (req, res) => {
    try {
      const { date } = req.query; // Get the date from the query parameters
  
      // Validate the date input
      if (!date) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Date is required",
        });
      }
  
      // Parse the date to ensure it's in the correct format
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Invalid date format",
        });
      }
  
      // Define the start and end of the day for the selected date
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
  
      // Query the database for attendance records on the selected date
      const results = await attendance.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }).populate('employeeId');
  
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
            break_time_start: '$attendance.break_time_start',
            break_time_finish: '$attendance.break_time_finish',
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
        message: "Attendance for the selected date loaded successfully",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        status: 500,
        message: err.message,
      });
    }
  };
  const getHolidaysByMonth = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { month } = req.query; // Get the month from the query
  
      // Convert the month string to a Date object
      const [year, monthIndex] = month.split('-'); // Expecting 'YYYY-MM'
      const currentYear = parseInt(year);
      const currentMonth = parseInt(monthIndex) - 1; // Convert to 0-based index
  
      console.log("Current Year:", currentYear, "Current Month:", currentMonth + 1);
  
      // Find all attendance records for the selected month (UTC conversion)
      const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1)); // Start of month in UTC
      const endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59)); // Last day of the month in UTC
  
      console.log("Start of Month (UTC):", startOfMonth, "End of Month (UTC):", endOfMonth);
  
      // Find attendance records for the employee in this month
      const attendances = await attendance.find({
        employeeId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth } // Query for records in the specified month
      });
  
      console.log("Attendance Records Found:", attendances);
  
      // Get all working days in the selected month, excluding weekends (Saturday and Sunday)
      const workingDays = [];
      for (let day = 1; day <= endOfMonth.getUTCDate(); day++) {
        const date = new Date(Date.UTC(currentYear, currentMonth, day));
        if (date.getUTCDay() !== 0 && date.getUTCDay() !== 6) { // Exclude Sundays (0) and Saturdays (6)
          workingDays.push(date.toISOString().split('T')[0]);
        }
      }
  
      console.log("Working Days:", workingDays);
  
      // Extract dates from attendance records
      const attendanceDates = attendances.map(a => a.createdAt.toISOString().split('T')[0]);
      console.log("Attendance Dates:", attendanceDates);
  
      // Identify days where attendance was not added (i.e., holidays)
      const holidays = workingDays.filter(day => !attendanceDates.includes(day));
  
      // Get yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
  
      // Filter out holidays that are today or in the future
      const holidaysUpToYesterday = holidays.filter(day => day <= yesterdayString);
  
      console.log("Holidays Count:", holidaysUpToYesterday.length);
  
      // Additional log for holidays
      holidaysUpToYesterday.forEach(holiday => {
        console.log("Holiday:", holiday);
      });
  
      // Send response
      res.json({
        success: true,
        status: 200,
        message: "Monthly holidays calculated successfully",
        data: {
          holidays: holidaysUpToYesterday,
          totalHolidays: holidaysUpToYesterday.length,
          totalWorkingDays: workingDays.length
        }
      });
  
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({
        success: false,
        status: 500,
        message: err.message
      });
    }
  };
  
  
  const getLateArrivalsByMonth = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { month } = req.query; // Expected in 'YYYY-MM' format

        const [year, monthIndex] = month.split('-').map(Number);
        const startOfMonth = new Date(Date.UTC(year, monthIndex - 1, 1));
        const endOfMonth = new Date(Date.UTC(year, monthIndex, 0, 23, 59, 59, 999));

        // Fetch attendance records within the specified month
        const attendanceRecords = await attendance.find({
            employeeId,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Filter for late arrivals based on total working hours less than 8 hours
        const lateArrivals = attendanceRecords.filter(record => {
            console.log("Processing Record:", record);

            const { check_in, check_out, break_time_start, break_time_finish } = record;

            if (check_in && check_out) {
                // Parse check-in and check-out times
                const [checkInHours, checkInMinutes] = check_in.split(':').map(Number);
                const [checkOutHours, checkOutMinutes] = check_out.split(':').map(Number);
                const [breakStartHours, breakStartMinutes] = break_time_start.split(':').map(Number);
                const [breakEndHours, breakEndMinutes] = break_time_finish.split(':').map(Number);

                // Combine dates and times
                const combinedCheckInDate = new Date(year, monthIndex - 1, 1, checkInHours, checkInMinutes);
                const combinedCheckOutDate = new Date(year, monthIndex - 1, 1, checkOutHours, checkOutMinutes);
                const combinedBreakStartDate = new Date(year, monthIndex - 1, 1, breakStartHours, breakStartMinutes);
                const combinedBreakEndDate = new Date(year, monthIndex - 1, 1, breakEndHours, breakEndMinutes);

                console.log("check_in time:", check_in, ", checkOut time:", check_out);
                console.log("Parsed checkIn time:", combinedCheckInDate);
                console.log("Parsed checkOut time:", combinedCheckOutDate);

                // Calculate total working hours
                const totalWorkingDuration = (combinedCheckOutDate - combinedCheckInDate) / (1000 * 60 * 60); // in hours
                const totalBreakDuration = (combinedBreakEndDate - combinedBreakStartDate) / (1000 * 60 * 60); // in hours

                const actualWorkingHours = totalWorkingDuration - totalBreakDuration;

                console.log("Total Working Duration (hours):", totalWorkingDuration);
                console.log("Total Break Duration (hours):", totalBreakDuration);
                console.log("Actual Working Hours:", actualWorkingHours);

                // Check if actual working hours are less than 8 hours
                return actualWorkingHours < 8; // 8 hours
            }
            return false;
        });

        res.json({
            success: true,
            status: 200,
            message: "Late arrivals for the month loaded successfully",
            data: lateArrivals,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message,
        });
    }
};

  
  
  

  
  
  


module.exports={addAttendance,getAll,getSingle,changeStatus,getEmployeeAttendance,getTodayAttendance,getTodayAttendanceByEmployeeId,getAttendanceByDate,getHolidaysByMonth,getLateArrivalsByMonth}