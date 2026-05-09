import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import { SignUp, logIn, logOut, getCurrentUser, VerifyOTP, googleLogin, refreshToken } from '../controllers/users.js'
import { isLoggedIn } from '../middleware.js'
import { authLimiter } from '../utils/rateLimiter.js'

const router = express.Router()

router.post("/signup", authLimiter, wrapAsync(SignUp))
router.post("/verify-otp", authLimiter, wrapAsync(VerifyOTP))
router.post("/login", authLimiter, wrapAsync(logIn))
router.post("/google-login", authLimiter, wrapAsync(googleLogin))
router.get("/refresh-token", wrapAsync(refreshToken))

// Protected route
router.get("/current_user", isLoggedIn, getCurrentUser)

router.get("/logout", logOut)

export default router