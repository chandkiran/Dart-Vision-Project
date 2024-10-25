import { Router } from "express";
import { loginUser,registerUser,logoutUser,refreshAccessToken } from "../controllers/register.controller.js";
import { verifyJwt } from "../../middleware/auth.middleware.js";
const router=Router();
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


// secured routes
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refreshToken").post(refreshAccessToken)

export default router