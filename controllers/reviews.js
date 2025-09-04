import Review from "../models/review.js";
import Blog from "../models/blog.js"

//create review route
export const createReview = async(req,res)=>{
    
    let blog = await Blog.findById(req.params.id)
    
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    blog.reviews.push(newReview)
    await newReview.save()
    await blog.save()
    req.flash("success", "Review Added! ")
    res.redirect(`/blogs/${blog._id}`)
}

//delete review route
export const destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params
    await Blog.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review Deleted! ")
    res.redirect(`/blogs/${id}`)
}

