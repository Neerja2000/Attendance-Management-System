 const mongoose=require('mongoose')

 const ratingSchema=new mongoose.Schema({

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
      }

 })
 const rating = mongoose.model('rating', ratingSchema);

module.exports = rating;