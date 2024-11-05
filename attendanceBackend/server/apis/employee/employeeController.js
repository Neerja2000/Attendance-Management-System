const Employee = require('./employeeModel');
const SECRET_KEY = 'robolaxyAttendance';
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");



const addEmployee = async (req, res) => {
    try {
        const {
            name, email, phone, address, joining_date, salary, experience,
            gender, userId, password
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !address || !joining_date || !salary || 
            !experience || !gender || !userId || !password) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "All fields are required"
            });
        }

        // Check if email, phone, or userId already exists
        const existingEmployee = await Employee.findOne({
            $or: [
                { email: email },
                { phone: phone },
                { userId: userId }
            ]
        });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Employee with the same email, phone, or userId already exists"
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        let total = await Employee.countDocuments();
        let newEmployee = new Employee({
            employeeId: total + 1,
            name,
            email,
            phone,
            address,
            joining_date,
            salary,
            experience,
            gender,
            userId,
            password: hashedPassword
        });

        const result = await newEmployee.save();
        return res.json({
            success: true,
            status: 200,
            message: "Employee added successfully",
            data: result
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: err.message
        });
    }
};


const getAll = async (req, res) => {
    try {
        // Fetch all active employees
        const employees = await Employee.find({ status: true });

        // Get the current date's month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Calculate the per-hour salary for each employee based on the current month
        for (const employee of employees) {
            const workingDaysInMonth = calculateWorkingDays(currentMonth, currentYear);
            const totalWorkingHours = workingDaysInMonth * 8; // assuming 8 working hours per day
            const perHourSalary = Math.round(parseFloat(employee.salary) / totalWorkingHours); // Round to nearest whole number

            // Update the employee's perHourSalary in the database
            employee.perHourSalary = perHourSalary;
            await employee.save();
        }

        // Return the updated employee list
        res.json({
            success: true,
            status: 200,
            message: "Get All Active Employees with Updated Per Hour Salary for Current Month",
            data: employees,
            totalEmployees: employees.length
               
            
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};

// Function to calculate the number of working days (excluding weekends) for a given month and year
function calculateWorkingDays(month, year) {
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate(); // Get total days in the given month
    let workingDays = 0;

    for (let i = 1; i <= totalDaysInMonth; i++) {
        const day = new Date(year, month, i).getDay();
        if (day !== 0 && day !== 6) { // Exclude Sundays (0) and Saturdays (6)
            workingDays++;
        }
    }

    return workingDays;
}



const getSingle = (req, res) => {
    const employeeId = req.query.id;

    // Validate that id is provided
    if (!employeeId) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Employee ID is required"
        });
    }

    Employee.findOne({ _id: employeeId })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    status: 404,
                    message: "Employee not found"
                });
            }
            res.json({
                success: true,
                status: 200,
                message: "Single Employee Loaded",
                data: result
            });
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                status: 400,
                message: err.message
            });
        });
};




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
if(!!req.body.userId)
    result.userId=req.body.userId
if(!!req.body.password)
    result.password=req.body.password


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

    // Validate that the id is provided
    if (!req.body.id) {
        validation = "_id is required";
    }

    if (validation) {
        res.status(400).send({ success: false, message: validation });
    } else {
        // Assuming the Employee model has a 'status' field
        Employee.findOneAndUpdate(
            { _id: req.body.id },
            { status: false }, // Set the status to false
            { new: true } // Return the updated document
        )
        .then((result) => {
            if (result == null) {
                res.status(400).json({
                    success: false,
                    message: "No employee found"
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Employee status updated to false successfully",
                    data: result
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: error.message
            });
        });
    }
};





const employeeLogin = (req, res) => {
    const { userId, password } = req.body;

    Employee.findOne({ userId })
        .then((employee) => {
            if (!employee) {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Invalid userId or password"
                });
            }

            // Compare the provided password with the hashed password stored in the database
            bcrypt.compare(password, employee.password)
                .then((isMatch) => {
                    if (!isMatch) {
                        return res.status(401).json({
                            success: false,
                            status: 401,
                            message: "Invalid userId or password"
                        });
                    }

                    // Generate JWT token upon successful login
                    const token = jwt.sign(
                        { id: employee._id, email: employee.email },
                        SECRET_KEY,
                        { expiresIn: '1h' }
                    );

                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: 'Employee logged in successfully',
                        token,
                        data: employee
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        success: false,
                        status: 500,
                        message: 'Error comparing passwords: ' + err.message
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                status: 500,
                message: 'Error finding employee: ' + err.message
            });
        });
};


const employeeUpdatePassword = (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    // Extract the token from the Authorization header or request body
    const token = req.headers['authorization'] || req.body.token;
    console.log("t",token)
  
    if (!token) {
      return res.status(401).send('No token provided');
    }
  
    // Verify and decode the token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid token');
      }
  
      const employeeId = decoded.id; // Assuming the token contains _id
      console.log("employeeId", employeeId);
      Employee.findOne({ _id: employeeId })
 
        .then(Employee => {
          if (!Employee) {
            return res.status(400).send('Employee not found');
          }
  
          bcrypt.compare(oldPassword, Employee.password)
            .then(isMatch => {
              if (!isMatch) {
                return res.status(400).send('Incorrect old password');
              }
  
              // Hash new password and update it in the database
              const hashedPassword = bcrypt.hashSync(newPassword, 10);
              Employee.password = hashedPassword;
              Employee.save()
                .then(() => {
                  res.status(200).json({
                    message: 'Password updated successfully',
                  });
                })
                .catch(err => {
                  res.status(500).send('Error updating password: ' + err);
                });
            })
            .catch(err => {
              res.status(500).send('Error comparing passwords: ' + err);
            });
        })
        .catch(err => {
          res.status(500).send('Error finding admin: ' + err);
        });
    });
  };


module.exports={
    addEmployee,getAll,getSingle,update,remove,employeeLogin,employeeUpdatePassword
}