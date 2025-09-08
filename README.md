# RapidPost

AI - Powered Blogging Platform

**Preview:** [https://rapidpost-r4ds.onrender.com/blogs](https://rapidpost-r4ds.onrender.com/blogs)

## Overview

RapidPost is the next-generation blogging platform powered by AI. Create, discover, and engage with intelligent content. With RapidPost, users can write blogs manually or use AI to generate amazing content in seconds.

## Features

- ✨ AI-powered blog content generation (choose tone, length, and format)
- 📝 Rich text editor for manual blog writing and editing
- 🖼️ Cloudinary integration for image uploads
- 🔒 User authentication and profile management
- 📋 Dashboard, blog management, and seamless publishing
- 📱 Responsive Bootstrap 5 UI with modern design
- 🧑‍💻 Powered by Node.js, Express, EJS, and MongoDB
- ❤️ Intractive Social features: likes,reviews,follow 
- 🔍 Search and Category filter
- 🔊 Read Aloud: Listen to blog posts with the integrated text-to-speech feature

## Technologies Used

- Node.js, Express.js, EJS
- MongoDB (via Mongoose)
- Passport.js for authentication
- Bootstrap 5 & custom CSS
- Quill Rich Text editor
- Cloudinary image hosting
- Gemini AI for content generation
- Architecture: Model-View-Controller (MVC)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nimishkumar07/RapidPost.git
   cd RapidPost
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add your MongoDB URI and Cloudinary credentials:
     ```
     DB_URL=your_mongodb_uri
     CLOUD_NAME=your_cloudinary_cloud_name
     CLOUD_API_KEY=your_cloudinary_api_key
     CLOUD_API_SECRET=your_cloudinary_api_secret
     SESSION_SECRET=your_session_secret
     ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Visit the platform:**
   Open [http://localhost:8080/blogs](http://localhost:8080/blogs) in your browser.

## Deployment

- Deployed on [Render](https://render.com/)
- Database hosted with MongoDB Atlas

  
## Usage

- **Browse Blogs:** See all published blogs on the home page.
- **Write a Blog:** Sign up/log in and click "Write" to create a new blog. Choose manual writing or use AI.
- **AI Generation:** Enter a topic, select tone, length, and format, then click "Generate Content".
- **Edit & Manage:** Edit or delete your blogs from the dashboard.
- **Profile:** Manage your user profile and settings.
- **Intractive Social features:** likes,reviews,follow 
- **Read Aloud:** Click the “Read Aloud” button on any blog post to have it spoken aloud.

## Complete Endpoint Reference

### Blog Management
- `GET /blogs` - List all blogs (index)
- `GET /blogs/new` - Show blog creation form (renderNewForm)
- `POST /blogs` - Create new blog (createBlog)
- `GET /blogs/:id` - Show individual blog (showBlog)
- `GET /blogs/:id/edit` - Show blog edit form (renderEditForm)
- `PUT /blogs/:id` - Update blog (updateBlog)
- `DELETE /blogs/:id` - Delete blog (destroyBlog)
- `POST /blogs/ai/generate` - AI content generation (generateBlog)

### User Authentication
- `GET /signup` - Show registration form (renderSignUpForm)
- `POST /signup` - Register user (SignUp)
- `GET /login` - Show login form (renderLogInForm)
- `POST /login` - Authenticate user (logIn)
- `GET /logout` - Log out user (logOut)

### Social Features
- `POST users/:id/follow` - Toggle follow user (toggleFollow)
- `GET users/:id` - View user profile (getProfile)
- `GET users/:id/edit` - Edit profile form (renderProfileEditForm)
- `PUT users/:id` - Update profile (updateProfile)
- `POST blogs/:id/likes` - Toggle blog like (toggleLike)
- `GET /blogs/saved` - List saved blogs (getSavedBlogs)
- `POST /blogs/:id/save` - Toggle save blog (toggleSaveBlog)
- `POST /blogs/:id/reviews` - Create review (createReview)
- `DELETE /blogs/:id/reviews/:reviewId` - Delete review (destroyReview)

## Support & Links


- [Contact Us](https://www.linkedin.com/in/nimishkumar07/)


---

© RapidPost. All rights reserved. Powered by AI technology.
