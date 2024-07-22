const admin=require("./adminModel")
const bcrypt=require("bcryptjs")
admin.findOne({email:'admin@gmail.com'})

.then(result=>{
    if(result==null)
    {
        let adminuser=new admin({
            adminId:1,
            name:"Admin",
            email:'admin@gmail.com',
            password:bcrypt.hashSync('123',10),
            
        })
        adminuser.save()
        .then(saveResult=>{
            console.log('admin created')     
        })
        .catch(err=>{
            console.log('error',err)
        })
    }
    else{
        console.log("admin already exists")
    }
}).catch(err=>{
    console.log("erroe in admin",err)
})