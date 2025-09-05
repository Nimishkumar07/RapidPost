import Blog from "./models/blog.js"
import Review from "./models/review.js"
import { blogSchema,reviewSchema } from './schema.js'
import ExpressError from "./utils/ExpressError.js"
import wrapAsync from "./utils/wrapAsync.js"

export const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // If it's a like/save/follow route, redirect back to the blog page instead
        if (req.originalUrl.includes("/likes")) {
            const blogId = req.params.id;
            req.session.redirectUrl = `/blogs/${blogId}`;
        } else {
            req.session.redirectUrl = req.originalUrl;
        }

        req.flash("error","you must be loggedIn")
        return res.redirect("/login")
    }
    next()
 }

 export const saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
        
    }
    next()
 }

 export const isOwner = async (req,res,next)=>{
    let {id} = req.params
    let blog = await Blog.findById(id)
    if (!blog.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the Author of this blog")
        return res.redirect(`/blogs/${id}`)
    }
    next()
 }

 
export const validateReview = (req,res,next)=>{
     let {error} = reviewSchema.validate(req.body)
     
     if(error){
         let errMsg = error.details.map((el)=>el.message).join(',')
         throw new ExpressError(400, errMsg)
     }
     else{
         next()
     }
 }

export const validateBlog = (req,res,next)=>{
     let {error} = blogSchema.validate(req.body)
     
     if(error){
         let errMsg = error.details.map((el)=>el.message).join(',')
         throw new ExpressError(400, errMsg)
     }
     else{
         next()
     }
 }

 export const isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params
    let review = await Review.findById(reviewId)
    if (!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the Author of this review")
        return res.redirect(`/blogs/${id}`)
    }
    next()
 }
