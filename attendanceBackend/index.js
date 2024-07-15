const express=require('express')
const db=require('./server/config/db')
const app=express()
const adminRoute=require("./server/routes/adminRoutes")
const employeeRoute=require("./server/routes/employeeRoutes")
const cors=require('cors')
app.use(cors())


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use("/admin",adminRoute)
app.use("/employee",employeeRoute)

app.listen(3000,(err)=>{
    if(err){
        console.log("Error occured",err)
    }
    else{
        console.log("server is running")
    }
})