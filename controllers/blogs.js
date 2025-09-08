import Blog from "../models/blog.js"
import User from "../models/user.js"
import main from "../gemini.js"

//index route
export const index = async(req,res)=>{

     const { q, category } = req.query;  // read query params
     let filter = {};

  // Search filter
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },        // case-insensitive match in title
      { description: { $regex: q, $options: "i" } }   // or description
    ];
  }

  // Apply category
  if (category && category !== "All") {
    filter.category = category;
  }

  // Fetch blogs with filter
  const allBlogs = await Blog.find(filter).populate("author");

   // Get distinct categories (for dynamic buttons/dropdown)
  const categories = await Blog.distinct("category");

  res.render("blogs/index", { allBlogs, q, category, categories });
}

//new route
export const renderNewForm = (req,res)=>{
    res.render("blogs/new")
}

//show route
export const showBlog = async(req,res,next)=>{
    let {id} = req.params
 // increment the views by 1 each time blog is viewed
  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },   // <-- increment by 1
    { new: true }             // return updated blog
  )
  .populate({ path: "reviews", populate: { path: "author" } })
  .populate("author");
    if(!blog){
        req.flash("error","Blog You requested for does not exist")
        return res.redirect("/blogs")
    }
    res.render("blogs/show", {blog, user:req.user,})
}


// create route
export const createBlog = async (req,res,next)=>{
    let url = req.file.path 
    let filename = req.file.filename
    const user = await User.findById(req.user._id).populate("blogs");
    const newBlog = new Blog(req.body.blog)
    newBlog.author = req.user._id
    newBlog.image = {url,filename}
   
    await newBlog.save()

    // Add the new blog to the user's blogs array
    // const user = await User.findById(req.user._id);
    user.blogs.push(newBlog._id);
    user.blogCount = user.blogs.length; // or user.blogCount += 1;
    await user.save();

    req.flash("success", "New Blog Created! ")
    res.redirect("/blogs")
}

//edit route
export const renderEditForm = async(req,res)=>{
    let {id} = req.params
    const blog = await Blog.findById(id)
    if(!blog){
        req.flash("error","Blog You requested for does not exist")
        return res.redirect("/blogs")
    }
    let originalImageUrl = blog.image.url
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250")
    res.render("blogs/edit",{blog,originalImageUrl})
}

//update route
export const updateBlog = async(req,res)=>{
    if(!req.body.blog){
        throw new ExpressError(400,"Send a valid data for blog")
    }
    let {id} = req.params
    let blog = await Blog.findByIdAndUpdate(id, {...req.body.blog})
    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        blog.image = {url,filename}
        await blog.save()
    }
    req.flash("success", "Blog Updated! ")
    res.redirect(`/blogs/${id}`)
}

//delete route
export const destroyBlog = async(req,res)=>{
    let {id} = req.params
    const blog = await Blog.findById(id)
    const user = await User.findById(req.user._id);
    let deletedBlog = await Blog.findByIdAndDelete(id)
    await user.removeBlog(blog._id);
    console.log(deletedBlog)
    req.flash("success", "Blog Deleted! ")

     // Decide redirect based on referrer
    const referer = req.get("Referer") || "";
    if (referer.includes("/users")) {
        return res.redirect(`/users/${req.user._id}`);
    }
    res.redirect("/blogs")
}

// generate with ai
export const generateBlog = async(req,res)=>{
    const { prompt, tone, length, format } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt required" });
    }

    
  try {
    const content = await main(prompt, tone, length, format);

    res.json({ success: true, content });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ success: false, error: "Failed to generate content" });
  }
    
}