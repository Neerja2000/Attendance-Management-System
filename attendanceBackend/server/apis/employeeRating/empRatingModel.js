const mongoose=require('mongoose')

const empRatingSchema=new mongoose.Schema({

   ratingId: {
       type: Number,
       required: true
     },
     employeeName: {
        type: String,
        required: true
      },
    
     rating:{
       type:Number,
       default:null,
       required:true
     },
     remarks:{
       type:String,
       default:null,
       required:true
     },
     createdAt: {
        type: Date,
        default: Date.now
    
      },
      status: {
        type: Boolean,
        default: true
      }

})
const rating = mongoose.model('emprating', empRatingSchema);

module.exports = rating;