const admin=require("./adminModel")
const bcrypt=require("bcryptjs")
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'robolaxyAttendance';
admin.findOne({email:'admin@gmail.com'})


.then(result=>{
    if(result==null)
    {
        let adminuser=new admin({
            adminId:1,
            name:"Admin",
            email:'admin@gmail.com',
            password:bcrypt.hashSync('123',10),
            
        })
        adminuser.save()
        .then(saveResult=>{
            console.log('admin created')     
        })
        .catch(err=>{
            console.log('error',err)
        })
    }
    else{
        console.log("admin already exists")
    }
}).catch(err=>{
    console.log("erroe in admin",err)
})


const adminLogin = (req, res) => {
    const { email, password } = req.body;
  
    admin.findOne({ email })
      .then(admin => {
        if (!admin) {
          return res.status(400).send('Admin not found');
        }
  
        const isMatch = bcrypt.compareSync(password, admin.password);
        if (!isMatch) {
          return res.status(400).send('Incorrect password');
        }
  
        const token = jwt.sign({ id: admin._id, email: admin.email }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({
          message: 'Admin logged in successfully',
          token
        });
      })
      .catch(err => {
        res.status(500).send('Error logging in: ' + err);
      });
  };

  module.exports={adminLogin}