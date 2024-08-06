import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv()
import jwt from 'jsonwebtoken'
import bcrypt  from 'bcrypt'

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
         index:true
    },
    avatar:{
        type:String,
        required:true,
        
    },
    coverImage:{
        type:String,
        
    },
    watchHistory:[
    
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video',
        
    }
   ],
    password:{
        type:String,
        required:[true,'password is required'],
        
    },
    refreshToken:{
        type:String,
        
        
    }
},{timestamps:true})


userSchema.pre('save', async function (next){
    if(!this.isModified("password")) return next()
     let salt  = await bcrypt.genSalt(10)
     this.password = await bcrypt.hash(this.password,salt)
     next();
})


userSchema.methods.isPasswordCorrect = async function(password){
return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
 return  jwt.sign(
        {
            _id:this._id,
            emial:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
}
// REFRESH_TOKEN_SECRET
userSchema.methods.generateRefreshToken = function(){
  return  jwt.sign(
        {
            _id:this._id,
    
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_RXPIRY}
    )
}
const User = mongoose.model("User",userSchema)

export default User