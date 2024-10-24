import {ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser=asyncHandler(async(req,res)=>{
    // Get user details from from end 
    const{email,username,password}=req.body
    console.log("email:",email)
    // Is email correct or not
    if(
        [email,username,password].some((field)=>field?.trim()=="")
    ){
       throw new ApiError(400,"All fields required") 
    }
    // Check if user already exits check by email/username
    const existedUser=await User.findOne({
        $or:[{username},{email}] //Checking by username or email
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }
    // create use object
    const user =await User.create({
      username:username.toLowerCase(),
      email ,
      password 
    })
     // remove password and refresh token
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }
   return res.status(201).json(
    new ApiResponse(201, createdUser, "User registerd successfully")
   )

    // check for user creation
})

export {registerUser}