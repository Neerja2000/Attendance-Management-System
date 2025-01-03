const mongoose=require('mongoose')

const empRatingSchema=new mongoose.Schema({

   ratingId: {
       type: Number,
       required: true
     },
     employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        ref:'employee'
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
const dailyrating = mongoose.model('empdailyrating', empRatingSchema);

module.exports = dailyrating;