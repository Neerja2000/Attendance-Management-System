const rating = require('./dailyRatingModel');
const Employee=require("../employee/employeeModel")
const addDailyRating = (req, res) => {
    const { rating: newRatingValue, remarks, employeeId } = req.body;

    // Ensure employeeId is not null
    if (!employeeId) {
        return res.status(400).json({
            success: false,
            message: "Employee ID is required."
        });
    }

    // Get the current date and time
    const currentDate = new Date();
    // Get the start of the day for the current date
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));

    // Check if there's already a rating from the same employee today
    rating.findOne({ employeeId, createdAt: { $gte: startOfDay } })
        .then(existingRating => {
            if (existingRating) {
                return res.status(400).json({
                    success: false,
                    message: "You can only add one rating per day."
                });
            }

            // Get the total number of ratings and create a new rating
            return rating.countDocuments()
                .then(total => {
                    const newRating = new rating({
                        ratingId: total + 1,
                        rating: newRatingValue,
                        remarks,
                        employeeId,  // Make sure employeeId is set
                        status: true
                    });

                    // Save the new rating
                    return newRating.save();
                });
        })
        .then(result => {
            if (!res.headersSent) {
                res.status(200).json({
                    success: true,
                    message: "Rating Added Successfully",
                    data: result
                });
            }
        })
        .catch(err => {
            if (!res.headersSent) {
                res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
        });
};

const getDailyRatings = (req, res) => {
    // Query the database for all ratings without any date filters
    rating.find({})
    .populate('employeeId', 'name') // Populate 'employeeId' field with 'name' only
    .then((result) => {
        res.json({
            success: true,
            status: 200,
            message: "Ratings Loaded Successfully",
            data: result
        });
    })
    .catch((err) => {
        res.json({
            success: false,
            status: 400,
            message: err.message
        });
    });
};

const getSingleEmployeeRating = (req, res) => {
    // Extract employee ID from request parameters or query parameters
    const { employeeId } = req.params; // Or use req.query.employeeId if it's passed as a query parameter
    
    if (!employeeId) {
        return res.json({
            success: false,
            status: 400,
            message: "Employee ID is required"
        });
    }

    // Get the current date
    const currentDate = new Date();
    
    // Find the Monday of the current week
    const startOfWeek = new Date(currentDate.getTime());
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0); // Set to the start of the day
    
    // Find the Friday of the current week
    const endOfWeek = new Date(startOfWeek.getTime());
    endOfWeek.setDate(startOfWeek.getDate() + 4);
    endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day

    // Query the ratings for the specific employee within the current week from Monday to Friday
    rating.find({
        employeeId: employeeId,
        createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek
        }
    })
    .populate('employeeId', 'name') // Populate 'employeeId' field with 'name' only
    .then((result) => {
        res.json({
            success: true,
            status: 200,
            message: "Ratings Loaded Successfully",
            data: result
        });
    })
    .catch((err) => {
        res.json({
            success: false,
            status: 400,
            message: err.message
        });
    });
};

  module.exports={addDailyRating, getDailyRatings,getSingleEmployeeRating}