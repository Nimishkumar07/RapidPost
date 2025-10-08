# 🚀 RapidPost

AI-Powered Blogging Platform with Real-Time Notifications

**🌐 Live Website:** [RapidPost](https://rapidpost-r4ds.onrender.com/blogs)

## 📝 Overview

RapidPost is the next-generation blogging platform powered by AI. Create, discover, and engage with intelligent content. With RapidPost, users can write blogs manually or use AI to generate amazing content in seconds. Stay connected with real-time notifications across all your devices!

## ✨ Features

### 🤖 **AI-Powered Content Creation**

- AI-powered blog content generation (choose tone, length, and format)
- Rich text editor for manual blog writing and editing
- Intelligent content suggestions and formatting

### 📱 **Real-Time Notification System**

- 🔔 **Push Notifications**: Receive notifications on your device even when not using the website
- 🌐 **Cross-Platform**: Works on mobile phones, tablets, laptops, and desktops
- ⚡ **Real-Time Updates**: Instant WebSocket notifications while browsing
- 🎯 **Smart Notifications**: Get notified for likes, comments, follows, and new posts
- ⚙️ **Customizable Preferences**: Control which notifications you receive
- 📊 **Notification Center**: Manage all your notifications in one place

### 🎨 **User Experience**

- 🖼️ Cloudinary integration for image uploads
- 🔒 User authentication and profile management
- 📋 Dashboard, blog management, and seamless publishing
- 📱 Fully responsive Bootstrap 5 UI with modern design
- ❤️ Interactive social features: likes, reviews, follow system
- 🔍 Advanced search and category filtering
- 🔊 Read Aloud: Listen to blog posts with integrated text-to-speech

### 🛠️ **Technical Excellence**

- 🧑‍💻 Powered by Node.js, Express, EJS, and MongoDB
- 🔄 Real-time WebSocket connections with Socket.io
- 📱 Progressive Web App (PWA) capabilities with Service Workers
- 🎯 MVC architecture for clean, maintainable code

## 💻 Technologies Used

### **Backend**

- **Node.js & Express.js** - Server-side JavaScript runtime and web framework
- **MongoDB & Mongoose** - NoSQL database with object modeling
- **Socket.io** - Real-time bidirectional event-based communication
- **Passport.js** - Authentication middleware for Node.js

### **Frontend**

- **EJS** - Embedded JavaScript templating engine
- **Bootstrap 5** - Modern CSS framework with custom styling
- **Quill Rich Text Editor** - WYSIWYG editor for blog content
- **Service Workers** - Background scripts for push notifications

### **AI & Cloud Services**

- **Google Gemini AI** - Advanced AI for intelligent content generation
- **Cloudinary** - Cloud-based image and video management
- **Web Push API** - Native push notifications across devices

### **Real-Time Features**

- **WebSocket Connections** - Live notifications and updates
- **Push Notification API** - Cross-device notification delivery
- **VAPID Protocol** - Secure push notification authentication

### **Architecture**

- **MVC Pattern** - Model-View-Controller architecture
- **Service Layer** - Organized business logic and external integrations
- **RESTful APIs** - Clean and consistent API endpoints

## 🚦 Getting Started

1. 🌀 **Clone the repository:**

   ```bash
   git clone https://github.com/Nimishkumar07/RapidPost.git
   cd RapidPost
   ```

2. 📦 **Install dependencies:**

   ```bash
   npm install
   ```

3. 🔑 **Configure environment variables:**

   - Create a `.env` file in the root directory.
   - Add your configuration variables:

     ```env
     # Database
     ATLASDB_URL=your_mongodb_uri

     # Cloudinary (Image Storage)
     CLOUD_NAME=your_cloudinary_cloud_name
     CLOUD_API_KEY=your_cloudinary_api_key
     CLOUD_API_SECRET=your_cloudinary_api_secret

     # Session & Security
     SECRET=your_session_secret

     # AI Integration
     GEMINI_API_KEY=your_gemini_api_key

     # Push Notifications (Optional - will use defaults if not provided)
     VAPID_PUBLIC_KEY=your_vapid_public_key
     VAPID_PRIVATE_KEY=your_vapid_private_key
     ```

4. ▶️ **Start the server:**

   ```bash
   npm start
   ```

5. **Visit the platform:**
   Open [http://localhost:8080/blogs](http://localhost:8080/blogs) in your browser.

## 🌐 Deployment

- Deployed on [Render](https://render.com/)
- Database hosted with MongoDB Atlas

## 📖 Usage

- **Browse Blogs:** See all published blogs on the home page.
- **Write a Blog:** Sign up/log in and click "Write" to create a new blog. Choose manual writing or use AI.
- **AI Generation:** Enter a topic, select tone, length, and format, then click "Generate Content".
- **Edit & Manage:** Edit or delete your blogs from the dashboard.
- **Profile:** Manage your user profile and settings.
- **Intractive Social features:** likes,reviews,follow
- **Read Aloud:** Click the “Read Aloud” button on any blog post to have it spoken aloud.

## � Notifitcation System

### **Real-Time Notifications**

RapidPost features a comprehensive notification system that keeps users engaged across all devices:

- **📱 Push Notifications**: Native device notifications that work even when the website is closed
- **⚡ WebSocket Updates**: Instant notifications while browsing the site
- **🎯 Smart Targeting**: Notifications for likes, comments, follows, and new posts
- **⚙️ User Control**: Customizable preferences for each notification type
- **📊 Notification Center**: Centralized management of all notifications
- **🌐 Cross-Platform**: Works on mobile, tablet, and desktop devices

### **Notification Types**

- **❤️ Likes**: When someone likes your blog posts
- **💬 Comments**: When someone comments on your posts
- **👥 Follows**: When someone starts following you
- **📝 New Posts**: When people you follow publish new content

### **How to Enable**

1. Visit the website and log in
2. Allow notifications when prompted (or go to `/notifications/preferences`)
3. Choose which types of notifications you want to receive
4. Test notifications to ensure they're working
5. Enjoy staying connected even when away from the site!

## 🔗 Complete Endpoint Reference

### 📝 Blog Management

- `GET /blogs` - List all blogs (index)
- `GET /blogs/new` - Show blog creation form (renderNewForm)
- `POST /blogs` - Create new blog (createBlog)
- `GET /blogs/:id` - Show individual blog (showBlog)
- `GET /blogs/:id/edit` - Show blog edit form (renderEditForm)
- `PUT /blogs/:id` - Update blog (updateBlog)
- `DELETE /blogs/:id` - Delete blog (destroyBlog)
- `POST /blogs/ai/generate` - AI content generation (generateBlog)

### 👤 User Authentication

- `GET /signup` - Show registration form (renderSignUpForm)
- `POST /signup` - Register user (SignUp)
- `GET /login` - Show login form (renderLogInForm)
- `POST /login` - Authenticate user (logIn)
- `GET /logout` - Log out user (logOut)

### 🔄 Social Features

- `POST users/:id/follow` - Toggle follow user (toggleFollow)
- `GET users/:id` - View user profile (getProfile)
- `GET users/:id/edit` - Edit profile form (renderProfileEditForm)
- `PUT users/:id` - Update profile (updateProfile)
- `POST blogs/:id/likes` - Toggle blog like (toggleLike)
- `GET /blogs/saved` - List saved blogs (getSavedBlogs)
- `POST /blogs/:id/save` - Toggle save blog (toggleSaveBlog)
- `POST /blogs/:id/reviews` - Create review (createReview)
- `DELETE /blogs/:id/reviews/:reviewId` - Delete review (destroyReview)

### 🔔 Notification System

- `GET /notifications` - View notifications page (getNotifications)
- `GET /notifications/preferences` - Notification preferences page (renderPreferencesPage)
- `GET /notifications/api/unread-count` - Get unread notification count (getUnreadCount)
- `POST /notifications/api/mark-read` - Mark notifications as read (markAsRead)
- `POST /notifications/api/mark-all-read` - Mark all notifications as read (markAllAsRead)
- `DELETE /notifications/api/:id` - Delete specific notification (deleteNotification)
- `GET /notifications/api/preferences` - Get user notification preferences (getUserPreferences)
- `POST /notifications/api/preferences` - Update notification preferences (updatePreferences)

### 📱 Push Notifications

- `GET /notifications/api/push/vapid-public-key` - Get VAPID public key (getVapidPublicKey)
- `POST /notifications/api/push/subscribe` - Subscribe to push notifications (subscribeToPush)
- `POST /notifications/api/push/unsubscribe` - Unsubscribe from push notifications (unsubscribeFromPush)
- `POST /notifications/api/push/test` - Send test push notification (sendTestPush)

## � Propject Structure

```
RapidPost/
├── 📁 controllers/          # Route handlers and business logic
│   ├── blogs.js            # Blog CRUD operations
│   ├── likes.js            # Like functionality
│   ├── follow.js           # Follow system
│   ├── reviews.js          # Comment system
│   ├── notifications.js    # Notification management
│   └── pushNotifications.js # Push notification handling
├── 📁 models/              # Database schemas
│   ├── blog.js             # Blog model
│   ├── user.js             # User model with notification preferences
│   ├── review.js           # Review/comment model
│   └── notification.js     # Notification model
├── 📁 services/            # Business logic and external integrations
│   ├── notificationService.js      # Core notification logic
│   ├── pushNotificationService.js  # Push notification handling
│   ├── notificationCleanup.js      # Cleanup old notifications
│   └── geminiService.js            # AI content generation
├── 📁 routes/              # API route definitions
│   ├── blog.js             # Blog routes
│   ├── user.js             # User authentication routes
│   ├── notifications.js    # Notification routes
│   └── ...
├── 📁 views/               # EJS templates
│   ├── 📁 blogs/           # Blog-related views
│   ├── 📁 users/           # User profile views
│   ├── 📁 notifications/   # Notification UI
│   │   ├── index.ejs       # Notification list (responsive)
│   │   └── preferences.ejs # Notification settings
│   └── 📁 layouts/         # Layout templates
├── 📁 public/              # Static assets
│   ├── 📁 js/              # Client-side JavaScript
│   │   └── script.js       # Notification manager & WebSocket client
│   ├── 📁 css/             # Stylesheets
│   └── sw.js               # Service Worker for push notifications
└── server.js               # Main application entry point with Socket.io
```

## 🚀 Key Features Breakdown

### **🤖 AI Integration**

- **Gemini AI**: Advanced content generation with customizable parameters
- **Smart Prompting**: Optimized prompts for different content types and tones
- **Content Formatting**: AI-generated content formatted for web display

### **🔔 Notification Architecture**

- **Real-Time Layer**: Socket.io for instant WebSocket notifications
- **Push Layer**: Web Push API with VAPID authentication for offline notifications
- **Storage Layer**: MongoDB with indexed notification collection
- **Service Layer**: Modular notification services with preference management

### **📱 Progressive Web App**

- **Service Worker**: Background processing and push notification handling
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Offline Capabilities**: Basic offline functionality with service worker caching

## 💬 Support & Links

- [Contact Us](https://www.linkedin.com/in/nimishkumar07/)

---

© RapidPost. All rights reserved. Powered by AI technology and real-time notifications.
