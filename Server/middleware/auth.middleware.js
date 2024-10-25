import jwt from "jsonwebtoken"
import { User } from "../src/models/users.models.js"
import { ApiError } from "../src/utils/ApiError.js"
import { asyncHandler } from "../src/utils/asyncHandler.js"

export const verifyJwt=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer","")
        if(!token){
            throw new ApiError(401,"Unauthorized access")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECTRET)
        const user=await User.findById(decodedToken?._id).select(
        -"password -refreshToken"
        )
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,err?.message||"Invalid access Token")
    }

})