const Employee = require('./employeeModel');
const SECRET_KEY = 'robolaxyAttendance';
const jwt = require('jsonwebtoken');



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
            password
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

module.exports = addEmployee;

const getAll = (req, res) => {
    Employee.find({ status: true })  // Filter for employees with status set to true
        .then((result) => {
            res.json({
                success: true,
                status: 200,
                message: "Get All Active Employees",
                data: result
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                status: 500,
                message: err.message
            });
        });
};

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

module.exports = getSingle;


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

    Employee.findOne({ userId, password })
        .then((employee) => {
            if (!employee) {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Invalid userId or password"
                });
            }

            const token = jwt.sign({ id: employee._id, email: employee.email }, SECRET_KEY, { expiresIn: '1h' });

            res.status(200).json({
                success: true,
                status: 200,
                message: 'Employee logged in successfully',
                token,
                data: employee
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



module.exports={
    addEmployee,getAll,update,remove,employeeLogin
}