const mongoose=require('mongoose')

const projectSchema=new mongoose.Schema({

   projectId: {
       type: Number,
       required: true
     },
     employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        ref:'employee'
      },
    
     projectName:{
       type:String,
       default:null,
       required:true
     },
     employeeNames:{
        type:String,
        required:true
     },
     projectDescription:{
      type:String,
      default:null,
      required:true
    },
     document:{
       type:String,
       default:null,
       
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
const projects = mongoose.model('projects', projectSchema);

module.exports = projects;