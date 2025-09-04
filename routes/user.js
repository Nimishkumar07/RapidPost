import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import User from '../models/user.js'
import passport from 'passport'
import { saveRedirectUrl } from '../middleware.js'
import { renderSignUpForm,SignUp,renderLogInForm,logIn,logOut } from '../controllers/users.js'

const router = express.Router()

router.get("/signup",renderSignUpForm)

router.post("/signup",wrapAsync(SignUp))

router.get("/login",renderLogInForm)

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true,
}),logIn)

router.get("/logout",logOut)

export default router