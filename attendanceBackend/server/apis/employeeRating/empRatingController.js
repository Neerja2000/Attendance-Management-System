const rating = require('./empRatingModel');



const addRating = async (req, res) => {
    const { rating: newRatingValue, remarks, employeeId } = req.body;

    try {
        // Get the current date and date one week ago
        const currentDate = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        // Check if there's already a rating from the same employee in the past week
        const existingRating = await rating.findOne({
            employeeId,
            createdAt: { $gte: oneWeekAgo }
        });

        if (existingRating) {
            return res.json({
                success: false,
                status: 400,
                message: "You can only add one rating per week."
            });
        }

        // Get the total number of ratings and create a new rating
        const total = await rating.countDocuments();
        const newRating = new rating({
            ratingId: total + 1,
            rating: newRatingValue,
            remarks,
            employeeId
        });

        // Save the new rating
        const result = await newRating.save();
        res.json({
            success: true,
            status: 200,
            message: "Rating Added Successfully",
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







const adminRating = async (req, res) => {
    try {
        const updatedRating = await rating.findOneAndUpdate(
            { _id: req.body._id },
            { $set: { adminRating: req.body.adminRating } },
            { new: true }
        );

        if (updatedRating) {
            res.json({
                success: true,
                status: 200,
                message: "Admin Rating Updated Successfully",
                data: updatedRating
            });
        } else {
            res.json({
                success: false,
                status: 404,
                message: "Employee Rating Not Found"
            });
        }
    } catch (err) {
        res.json({
            success: false,
            status: 400,
            message: err.message
        });
    }
};





const getAll = async (req, res) => {
    try {
      const { week, month } = req.query; // Get week and month from query parameters
      
      const startDate = new Date(); 
      const endDate = new Date();
      
      // Set the start and end dates based on the provided month and week
      if (month) {
        const [year, monthNum] = month.split('-');
        startDate.setFullYear(year, monthNum - 1, 1);
        endDate.setFullYear(year, monthNum, 0);
      }
  
      if (week) {
        const weekNum = parseInt(week.replace('week', ''));
        const startOfWeek = startDate.getDate() + (weekNum - 1) * 7;
        startDate.setDate(startOfWeek);
        endDate.setDate(startOfWeek + 6);
      }
      
      const ratings = await rating.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).populate('employeeId');
  
      res.json({
        success: true,
        status: 200,
        message: "Get All Rating",
        data: ratings
      });
    } catch (err) {
      res.json({
        success: false,
        status: 400,
        message: err.message
      });
    }
  };


  const getSingle = async (req, res) => {
    try {
      const { employeeId } = req.params; // Get employeeId from request parameters
  
      // Find all ratings for the specified employeeId and populate employee details
      const ratings = await rating.find({ employeeId: employeeId }).populate('employeeId');
  
      if (ratings.length > 0) {
        res.json({
          success: true,
          status: 200,
          message: "Ratings Retrieved Successfully",
          data: ratings
        });
      } else {
        res.json({
          success: false,
          status: 404,
          message: "No Ratings Found for This Employee"
        });
      }
    } catch (err) {
      res.json({
        success: false,
        status: 400,
        message: err.message
      });
    }
  };
  

module.exports={addRating,getAll,adminRating,getSingle}