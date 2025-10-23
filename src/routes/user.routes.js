import {Router} from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js"
import { User } from '../models/user.models.js'
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    deleteProfile,
    updateAccountDetails,
    getCurrentUser,
} from "../controllers/user.controller.js"

const router = Router();

    router.route("/register").post(
        upload.fields([
        {
            name : "coverImage",
            maxCount:1,
        }
        ]),registerUser
    )

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/get-user").post(verifyJWT,getCurrentUser)
router.route("/delete-profile").post(verifyJWT,deleteProfile)
router.route("/update-account").patch(verifyJWT , updateAccountDetails)

export default router;



