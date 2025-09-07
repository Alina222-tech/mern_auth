const mongoose=require("mongoose")
 const user= new mongoose.Schema({
    First_Name:{
        type:String,
        require:true,
        trim:true
    },
    Last_Name:{
         type:String,
        require:true,
        trim:true

    },
    email:{
         type:String,
        require:true,
        trim:true,
        unique:true,
        lowercase:true

    },
    password:{
         type:String,
        require:true,
        trim:true
    },
    profile_image:{
         type:String,
        require:true,
        trim:true
    }
    
 },
 { timestamps:true}
)

module.exports=mongoose.model("user_auth",user)