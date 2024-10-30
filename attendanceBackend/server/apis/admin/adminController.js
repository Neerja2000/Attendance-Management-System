const admin = require("./adminModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'robolaxyAttendance';

admin.findOne({ email: 'admin@gmail.com' })
  .then(result => {
    if (result == null) {
      let adminuser = new admin({
        adminId: 1,
        name: "Admin",
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123', 10),
      });
      adminuser.save()
        .then(saveResult => {
          console.log('Admin created');
        })
        .catch(err => {
          console.log('Error', err);
        });
    } else {
      console.log("Admin already exists");
    }
  })
  .catch(err => {
    console.log("Error in admin", err);
  });

const adminLogin = (req, res) => {
  const { email, password } = req.body;

  

  admin.findOne({ email })
    .then(admin => {
      if (!admin) {
        return res.status(400).send('Admin not found');
      }

      bcrypt.compare(password, admin.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).send('Incorrect password');
          }

          const token = jwt.sign({ id: admin._id, email: admin.email }, SECRET_KEY, { expiresIn: '1h' });
          res.status(200).json({
            message: 'Admin logged in successfully',
            id: admin._id, 
            token
          });
        })
        .catch(err => {
          res.status(500).send('Error comparing passwords: ' + err);
        });
    })
    .catch(err => {
      res.status(500).send('Error logging in: ' + err);
    });
};


const adminUpdatePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Extract the token from the Authorization header or request body
  const token = req.headers['authorization'] || req.body.token;
  console.log("ttt",token)

  if (!token) {
    return res.status(401).send('No token provided');
  }

  // Verify and decode the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }

    const email = decoded.email; // Extract email from the token
console.log("email",email)
    admin.findOne({ email })
      .then(admin => {
        if (!admin) {
          return res.status(400).send('Admin not found');
        }

        bcrypt.compare(oldPassword, admin.password)
          .then(isMatch => {
            if (!isMatch) {
              return res.status(400).send('Incorrect old password');
            }

            // Hash new password and update it in the database
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            admin.password = hashedPassword;
            admin.save()
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


module.exports = { adminLogin,adminUpdatePassword };
