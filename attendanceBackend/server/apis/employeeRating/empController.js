const rating = require('./empRatingModel');

const addRating=async(req,res)=>{
    let total=await rating.countDocuments()
    let newRating = new rating({
        ratingId:total+1,
        rating:req.body.rating,
        remarks:req.body.remarks,
        employeeId:req.body.employeeId
        
    })
    newRating.save()
    .then((result)=>{
        res.json({
            success:true,
            status:200,
            message:"Rating Added Successfully",
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

const getAll=(req,res)=>{
    rating.find()
    .then((result)=>{
        res.json({
            success:true,
            status:200,
            message:"Get All Rating",
            data:result
        })
    })
    .catch((err)=>{
        res.json({
            success:false,
            status:400,
            message:err
        })
    })
}
module.exports={addRating,getAll}