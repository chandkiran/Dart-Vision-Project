import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
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
    },
    refreshToken: {
        type: String
    }
},{timestamps:true})

// Using mongoose hooks for password storing
userSchema.pre("save",async function(next){
    // password encryption
    if (!this.isModified("password")) return next();
   this.password= await bcrypt.hash(this.password,10)
   next();
})
// checking if password is correct or not
userSchema.methods.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password)
}
// generating access and refresh token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)