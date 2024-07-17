const rating = require('./empRatingModel');




const addRating = async (req, res) => {
    let total = await rating.countDocuments();
    let newRating = new rating({
        ratingId: total + 1,
        rating: req.body.rating,
        remarks: req.body.remarks,
        employeeId: req.body.employeeId
    });
    newRating.save()
        .then((result) => {
            res.json({
                success: true,
                status: 200,
                message: "Rating Added Successfully",
                data: result
            });
        }).catch(err => {
            res.json({
                success: false,
                status: 400,
                message: err.message
            });
        });
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
  
module.exports={addRating,getAll,adminRating}