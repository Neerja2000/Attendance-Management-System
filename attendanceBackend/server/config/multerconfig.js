const multer = require("multer");
const path = require('path');

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './server/public/projectDocument'); // Specify the directory for file uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the original filename
    }
});

// Initialize the upload middleware with the storage configuration
const upload = multer({ storage: storage });
module.exports = upload;








