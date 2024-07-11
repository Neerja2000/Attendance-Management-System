const express=require('express')
const db=require('./server/config/db')
const app=express()
const adminRoute=require("./server/routes/adminRoutes")

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use("/admin",adminRoute)

app.listen(3000,(err)=>{
    if(err){
        console.log("Error occured",err)
    }
    else{
        console.log("server is running")
    }
})