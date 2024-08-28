const rating = require('./dailyRatingModel');
const addDailyRating = (req, res) => {
    const { rating: newRatingValue, remarks, employeeId } = req.body;
  
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
                        employeeId
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

  const getDailyRating =(req,res)=>{
    rating.find()   
     .then((result)=>{
        res.json({
            success:true,
            status:200,
            message:"Attendance Loaded Successfully",
            data:result
        })
    }).catch(err=>{
        res.json({
            success:false,
            status:400,
            message:err.message
        })
    })
  }
  module.exports={addDailyRating,getDailyRating}