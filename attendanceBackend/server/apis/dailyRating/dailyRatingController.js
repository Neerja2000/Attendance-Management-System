const rating = require('./dailyRatingModel');
const Employee=require("../employee/employeeModel")
const addDailyRating = (req, res) => {
    const { rating: newRatingValue, remarks, employeeId, date } = req.body;
  
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required."
      });
    }
  
    // Ensure the date is in the correct format (YYYY-MM-DD)
    const ratingDate = new Date(date);
    const startOfDay = new Date(ratingDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(ratingDate.setHours(23, 59, 59, 999));
  
    // Check if there's already a rating from the same employee on the selected date
    rating.findOne({ employeeId, createdAt: { $gte: startOfDay, $lte: endOfDay } })
      .then(existingRating => {
        if (existingRating) {
          return res.status(400).json({
            success: false,
            message: "You can only add one rating per day."
          });
        }
  
        return rating.countDocuments()
          .then(total => {
            const newRating = new rating({
              ratingId: total + 1,
              rating: newRatingValue,
              remarks,
              employeeId,
              status: true,
              createdAt: ratingDate,  // Use the correct date
            });
  
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
    // Extract employee ID from request parameters
    const { employeeId } = req.params; // Or use req.query.employeeId if passed as a query parameter
    
    if (!employeeId) {
        return res.json({
            success: false,
            status: 400,
            message: "Employee ID is required"
        });
    }

    // Query the ratings for the specific employee (no date filter)
    rating.find({
        employeeId: employeeId
    })
    .populate('employeeId', 'name') // Populate 'employeeId' field with 'name' only
    .then((result) => {
        res.json({
            success: true,
            status: 200,
            message: "Employee Ratings Loaded Successfully",
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