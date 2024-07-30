const jwt = require("jsonwebtoken");
const SECRET_KEY = 'robolaxyAttendance';

module.exports = (req, res, next) => {
    // Get the authorization header
    let token = req.headers['authorization'];

    if (token) {
        // Remove 'Bearer ' from the token if present
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        // Verify the token
        jwt.verify(token, SECRET_KEY, (err, data) => {
            if (err) {
                // Invalid token or token verification failed
                res.status(401).send({ success: false, message: 'Unauthorized User' });
            } else {
                // Token is valid, attach decoded data to the request object
                req.user = data;
                next();
            }
        });
    } else {
        // No token was provided
        res.status(400).send({ success: false, message: "No token" });
    }
};
