import mongoose from "momgoose"
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true,
        lowrcase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:[true,"password is required"]
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

export const User=mongoose.model("User",userSchema)