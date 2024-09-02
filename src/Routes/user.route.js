import express from 'express'
import { login, logout, regsisterUser } from '../contraollers/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
const router = express.Router()


router.post('/register',
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
  
    regsisterUser)

    router.post("/login",login)

    // secure Route

    router.get("/logout",verifyJWT,logout)


export default router