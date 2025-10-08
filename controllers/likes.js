
import Blog from "../models/blog.js";
import notificationService from "../services/notificationService.js";

export const toggleLike = async (req, res) => {
   
        let {id} = req.params // blog id
        // console.log(id)
        const userId = req.user._id; // currently logged in user

        const blog = await Blog.findById(id).populate('author', 'name username');

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if user already liked
        const alreadyLiked = blog.likes.includes(userId);

        if (alreadyLiked) {
            // Unlike
            blog.likes.pull(userId);
        } else {
            // Like
            blog.likes.push(userId);
            
            // Create notification for blog author (only if not liking own post)
            if (blog.author._id.toString() !== userId.toString()) {
                try {
                    const notification = await notificationService.createNotification({
                        recipient: blog.author._id,
                        sender: userId,
                        type: 'like',
                        message: `${req.user.name} liked your blog post "${blog.title}"`,
                        relatedBlog: blog._id
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
                    console.error('Error creating like notification:', error);
                    
                }
            }
        }

        await blog.save();

        res.redirect(`/blogs/${id}`);
    
};
