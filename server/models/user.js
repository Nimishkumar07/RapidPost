import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String
    },
    avatar: {
        url: {
            type: String,
            default: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d'
        },
        filename: String,
    },
    bio: {
        type: String,
        maxlength: 250,
        default: 'Always Excited to share Thoughts !'
    },
    socialLinks: {
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        instagram: { type: String, default: '' },
    },
    // Stores the id of all blogs created by this user
    blogs: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    blogCount: {
        type: Number,
        default: 0
    },
    savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notificationPreferences: {
        likes: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        follows: { type: Boolean, default: true },
        newPosts: { type: Boolean, default: true }
    },
    pushSubscriptions: [{
        endpoint: String,
        keys: {
            p256dh: String,
            auth: String
        }
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        default: null
    },
    activeSessions: [{
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }]
}, {
    timestamps: true
});

userSchema.methods.addBlog = async function (blogId) {
    this.blogs.push(blogId);
    this.blogCount = this.blogs.length;
    await this.save();
};

// Middleware when a blog is removed from user
userSchema.methods.removeBlog = async function (blogId) {
    this.blogs = this.blogs.filter(id => id.toString() !== blogId.toString());
    this.blogCount = this.blogs.length;
    await this.save();
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

const User = mongoose.model('User', userSchema);
export default User;