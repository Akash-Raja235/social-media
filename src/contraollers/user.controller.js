
import User from '../models/user.model.js'
import { APiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/clodinary.js'




const generateAccessAndRefreshToekn = async(userId)=>{
    try {
        
        const user = await User.findById(userId)
        
         const accessToken  = user.generateAccessToken()
         const refreshToken  = user.generateRefreshToken()

         user.refreshToken = refreshToken

         await user.save({validateBeforeSave:false})
         return {accessToken, refreshToken}
    } catch (error) {
        throw new APiError(500,"Something went Wrong while generating access and refresh Toekn")  
    }
}

const regsisterUser = asyncHandler(async(req,res)=>{

// get user detail 
// all inputs are valid or not
// check user is already signed up
//check images , check avatar
//upload them to cloudinary
// create user
// send successfull response

const {fullName,username, email, password} = req.body

// if(!fullName || !username || !email || !password){
//     throw new APiError(400,'All Fields are Required')
// }

if(
    [fullName,username,email,password].some((field)=>field?.trim() ==="")
){
    throw new APiError(400,"All fields are required")
}

const oldUser = await User.findOne({$or:[{email},{username}]})
if(oldUser){
    throw new APiError(409,'This User Already Exists Please Go for Login') 
}
   

 const avatarLocalPath = req.files?.avatar?.[0]?.path
 const coverImageLocalPath = req.files?.coverImage?.[0]?.path 

 if(!avatarLocalPath){
    throw new APiError(400,"Avatar is required")
 }

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)


if(!avatar){
    throw new APiError(400,"Avatar is required") 
}

const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase(),
  
})
 const registedUser = await User.findById(user._id).select("-password -refreshToken")

 if(!registedUser){
    throw new APiError(500,"Something Went Wrong While Registering User") 
 }
return res.status(200).json(
    new ApiResponse(200,registedUser,"User has been Successfuly Registed")
)


})

const login  = asyncHandler(async(req,res)=>{

    // check input fields valid or not , if not then throw error
    // check  user is exists or not if not then throw errow
    // check password is valid or not 
    // generate token 
    // generate refresh token 
    // update refrsh Toeken in user detail
    // set cookie in client side 
    // rend success resonse with , access token, Refresh Token

    const {username, email, password} = req.body

    if(!(username || email) || !password){
        throw new APiError(400, "All Fields are required")
    }

    const user = await User.findOne({$or:[{username},{email}]})

    if(!user){
        throw new APiError(404, "User is Not Exits, Go for Sign Up")   
    }

    const checkPassword = await user.isPasswordCorrect(password)
    if(!checkPassword){
        throw new APiError(401, "Login Credential is not Valid")   
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToekn(user._id)

     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


     const option ={
        httpOnly:true,
        secure:true
     }
     return res.status(200)
     .cookie("accessToken",accessToken,option)
     .cookie("refreshToken", refreshToken,option)
     .json(
        new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User Logged In Successfully")
     )

})


const logout = asyncHandler(async(req,res)=>{

    await User.findByIdAndUpdate(req.user._id,{refreshToken:undefined},{new:true})

    const option ={
        httpOnly:true,
        secure:true
     }

     return res.status(200)
     .clearCookie("accessToken",option)
     .clearCookie("refreshToken",option)
     .json(
        new ApiResponse(200,{},"User Logged Out")
     )
})


export {regsisterUser,login,logout}