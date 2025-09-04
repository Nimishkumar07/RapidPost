
import Blog from "../models/blog.js";

export const toggleLike = async (req, res) => {
   
        let {id} = req.params // blog id
        // console.log(id)
        const userId = req.user._id; // currently logged in user

        const blog = await Blog.findById(id);

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
        }

        await blog.save();

        res.redirect(`/blogs/${id}`);
    
};
