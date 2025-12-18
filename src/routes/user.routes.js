import { Router } from "express";
import { registerUser, loginUser ,logoutUser} from "../controller/user.controller.js"
import { upload } from "../middleware/multer.middleware.js";
import { authHandler } from "../middleware/auth.middleware.js";



const router = Router()

router.route("/register").post( 
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
    ]
    ),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post( authHandler ,logoutUser)



export default router