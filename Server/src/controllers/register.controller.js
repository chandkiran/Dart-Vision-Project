import {ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// Generate access and refresh token
// Access token for authorization of user to access protected resources .Refresh token to obtain new access token
const generateAcessAndRefreshTokens=async(userId)=>{
    // userId is returned by the user object created below
    try{
    const user=await User.findById(userId)
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false })
    return {accessToken,refreshToken}

    }
    catch(error){
        throw new ApiError(500,"Something went wrong while generating access and refresh token")

    }
}
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
    // checking for user creation
    if (!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }
   return res.status(201).json(
    new ApiResponse(201, createdUser, "User registerd successfully")
   )
})
// Login user
const loginUser=asyncHandler(async(req,res)=>{
     const{email,username,password}=req.body;
     if (!username||!email){
        throw newApiError(400,"username and email required")
     }
    //Find user by username or email  
     const user=await User.findOne({
        $or:[{email},{username}]
     })
    //  if use doesnt exist
     if(!user){
        throw new ApiError(400,"user not found")
     }
    //  check password 
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Incorrect password")
     }
    //  USing access token and refresh token
    const {accessToken,refreshToken}=await generateAcessAndRefreshTokens(user._id)
   const loggedInUser= User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,accessToken,
            refreshToken
        },"User logged in successfully")
    )
    
})
// Logging out user
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out"))
})
    

11
export {registerUser,
loginUser,
logoutUser}