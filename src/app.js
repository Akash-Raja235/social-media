import express from 'express'
import { configDotenv } from 'dotenv'
configDotenv()
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) //except 16kb data as json
app.use(express.urlencoded({extended:true})) // get url or params data
app.use(express.static("public")) // get file date
app.use(cookieParser()) // get data inside cookies from frontend
export default app