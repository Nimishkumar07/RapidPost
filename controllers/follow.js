import User from "../models/user.js";

// Toggle follow/unfollow
export const toggleFollow = async (req, res) => {
  const currentUserId = req.user._id; 
  const targetUserId = req.params.id; 
  const blogId = req.query.blogId; // optional

  if (currentUserId.toString() === targetUserId) {
    req.flash("error", "You cannot follow yourself");
    return blogId
      ? res.redirect(`/blogs/${blogId}`)
      : res.redirect(`/users/${targetUserId}`);
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    req.flash("error", "User not found");
    return blogId
      ? res.redirect(`/blogs/${blogId}`)
      : res.redirect(`/users/${targetUserId}`);
  }

  const alreadyFollowing = currentUser.following.includes(targetUserId);

  if (alreadyFollowing) {
    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);
  } else {
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
  }

  await currentUser.save();
  await targetUser.save();

  // final redirect
  return blogId
    ? res.redirect(`/blogs/${blogId}`)
    : res.redirect(`/users/${targetUserId}`);
};


// Get user profile page
export const getProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate("followers", "username")
    .populate("following", "username")
    .populate({
      path: "blogs",
      populate: [
        { path: "reviews" }, // so we can count comments
        { path: "likes" }    // so we can count likes
      ]
    })
    .populate("savedBlogs")
  
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("back");
  }

    // ---- Analytics ----
  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;

  user.blogs.forEach(blog => {
    totalViews += blog.views || 0;
    totalLikes += blog.likes ? blog.likes.length : 0;
    totalComments += blog.reviews ? blog.reviews.length : 0;
  });

  const currentUser = req.user; // logged-in user

  res.render("users/userProfile", {
    
    user,
    currentUser,
    followersCount: user.followers.length,
    followingCount: user.following.length,
     totalViews,
    totalLikes,
    totalComments
  });
};


export const renderProfileEditForm = async(req,res)=>{
  let {id} = req.params
    const user = await User.findById(id)
    if(!user){
        req.flash("error","Blog You requested for does not exist")
        return res.redirect(`/users/${id}`)
    }
    let originalAvatarUrl = user.avatar.url
    originalAvatarUrl = originalAvatarUrl.replace("/upload", "/upload/h_200,w_250")
    res.render("users/editProfile",{user,originalAvatarUrl})
 
}

export const updateProfile = async (req,res)=>{
  if(!req.body.user){
        throw new ExpressError(400,"Send a valid data for user")
    }
    let {id} = req.params
    let user = await User.findByIdAndUpdate(id, {...req.body.user})
 
    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        user.avatar = {url,filename}
        await user.save()
    }
    req.flash("success", "Profile Updated! ")
    res.redirect(`/users/${id}`)
  
}
