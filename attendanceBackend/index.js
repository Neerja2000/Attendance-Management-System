const express=require('express')
const app=express()
app.listen(3000,(err)=>{
    if(err){
        console.log("Error occured",err)
    }
    else{
        console.log("server is running")
    }
})