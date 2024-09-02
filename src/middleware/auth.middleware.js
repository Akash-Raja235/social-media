
import { configDotenv } from "dotenv"
configDotenv()
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from 'jsonwebtoken'
import { APiError } from "../utils/ApiError.js"
import User from "../models/user.model.js"


export const verifyJWT = asyncHandler(async(req,res,next)=>{

try {
    const token =   req.cookies?.accessToken || req.header("Authorization").split(" ")[1]

   
    // req.header("Authorization")?.replace("Bearer ","")
    
     const decoded =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

     
     if(!decoded){
        throw new APiError(401, "Token is Not Valid")
     }

     const user = await User.findById(decoded?._id).select("-password -refreshToken")
     req.user = user

     next()
} catch (error) {
    throw new APiError(401, error?.message || "Invalid Access Token")
}

    
})