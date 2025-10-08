import Review from "../models/review.js";
import Blog from "../models/blog.js"
import notificationService from "../services/notificationService.js";

//create review route
export const createReview = async(req,res)=>{
    
    let blog = await Blog.findById(req.params.id).populate('author', 'name username')
    
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    blog.reviews.push(newReview)
    await newReview.save()
    await blog.save()
    
    // Create notification for blog author (only if not commenting on own post)
    if (blog.author._id.toString() !== req.user._id.toString()) {
        try {
            const commentPreview = req.body.review.comment.length > 50 
                ? req.body.review.comment.substring(0, 50) + '...' 
                : req.body.review.comment;
                
            const notification = await notificationService.createNotification({
                recipient: blog.author._id,
                sender: req.user._id,
                type: 'comment',
                message: `${req.user.name} commented on your blog post "${blog.title}": "${commentPreview}"`,
                relatedBlog: blog._id,
                relatedComment: newReview._id
            });
            
            // Send real-time notification if created
            if (notification && req.io) {
                await notificationService.sendRealTimeNotification(
                    blog.author._id, 
                    notification, 
                    req.io
                );
            }
        } catch (error) {
            console.error('Error creating comment notification:', error);
            // Don't break the comment functionality if notification fails
        }
    }
    
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

