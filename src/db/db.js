import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
        console.log('Mongodb is connected')
    } catch (error) {
      console.log("MOngodb connection error",error) 
      process.exit(1) 
    }
}

export default connectDB