import User from "../models/user.js";

export const renderSignUpForm = (req,res)=>{
    res.render("users/signup")
}

export const SignUp = async(req,res)=>{
    try{
        let {name,username,email,password}=req.body
        const newUser = new User({name,email,username})
        const registeredUser = await User.register(newUser,password)
        console.log(registeredUser)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to RapidPost")
            res.redirect("/blogs")
        })
        
    }catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

export const renderLogInForm = (req,res)=>{
    res.render("users/login")
}

export const logIn = async(req,res)=>{
    req.flash("success","welcome back to RapidPost")
    let redirectUrl = res.locals.redirectUrl || "/blogs"
    res.redirect(redirectUrl)
}

export const logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logged Out")
        res.redirect("/blogs")
    })
}