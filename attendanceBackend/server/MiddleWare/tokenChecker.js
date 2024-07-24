const jwt = require("jsonwebtoken");
const SECRET_KEY = 'robolaxyAttendance';

module.exports = (req, res, next) => {
    let token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, data) => {
            if (err) {
                res.status(401).send({ success: false, message: 'Unauthorized User' });
            } else {
                // Optionally, attach the decoded data to the request object
                req.user = data;
                next();
            }
        });
    } else {
        res.status(400).send({ success: false, status: 400, message: "No token" });
    }
};
