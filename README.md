# 🚀 RapidPost

**AI-Powered Blogging Platform with Real-Time Notifications**

**🌐 Live Website:** [RapidPost](https://rapidpost-client.vercel.app/)

⚠️ Note: It may take some time to load ⏳ since it’s deployed on the free Render tier.

## 📝 Overview

RapidPost is a modern, full-stack blogging platform powered by AI. It features a robust **MERN Stack** architecture (MongoDB, Express, React, Node.js) designed for performance and scalability. Users can write blogs manually or use AI to generate amazing content in seconds. They can engage with content in real-time through instant notifications, live comments, and dynamic updates.

## ✨ Features

### 🤖 **AI & Content**
- **AI-Powered Writing**: Generate blog content in seconds using Google Gemini AI (customizable tone, length, format).
- **Rich Text Editor**: Full WYSIWYG editor for manual writing.
- **Read Aloud**: Integrated text-to-speech for accessible content consumption.

### 📱 **Real-Time Experience**
- **Instant Updates**: Comments, likes, and follows update instantly across all connected clients via Socket.IO.
- **Global Toast System**: Non-intrusive, beautiful notification popups for user actions.
- **Push Notifications**: Native device notifications even when the app is closed.

### ⚡ **Performance & Architecture**
- **Single Page Application (SPA)**: Built with React and Vite for a seamless, app-like feel.
- **Lazy Loading**: Route-based code splitting to minimize initial load time.
- **Optimized Navigation**: Smart scroll restoration for a natural browsing experience.
- **Monorepo Structure**: Clean separation of concerns with distinct `client` and `server` directories.

## 💻 Tech Stack

### **Frontend (`/client`)**
- **React 18** - Functional components & Hooks
- **Vite** - Next-generation build tool
- **React Router 6** - Client-side routing
- **Bootstrap 5** - Responsive UI components
- **Context API** - Global state management (Auth, Notifications, Toasts)

### **Backend (`/server`)**
- **Node.js & Express** - Scalable server runtime
- **MongoDB & Mongoose** - Document-based database
- **Socket.IO** - Real-time bidirectional communication
- **Passport.js** - Secure authentication strategies
- **Cloudinary** - Cloud image storage & optimization

## 📂 Project Structure

```bash
RapidPost/
├── 📁 client/              # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable UI components
│   │   ├── 📁 context/     # Global state (Auth, Toast, Notifications)
│   │   ├── 📁 pages/       # Route pages (Home, Login, BlogDetails)
│   │   └── 📁 features/    # Feature-specific logic (Blog, User)
│   └── vite.config.js
│
├── 📁 server/              # Node.js Backend
│   ├── 📁 controllers/     # Request handlers
│   ├── 📁 models/          # Mongoose schemas
│   ├── 📁 routes/          # API endpoints
│   ├── 📁 services/        # Business logic (AI, Notifications)
│   └── server.js           # Entry point
└── README.md
```

## 🚦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Nimishkumar07/RapidPost.git
cd RapidPost
```

### 2. Setup Backend (`/server`)
```bash
cd server
npm install
```
Create a `.env` file in `server/` with the following:
```env
ATLASDB_URL=your_mongodb_uri
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_key
CLOUD_API_SECRET=your_secret
SECRET=your_session_secret
GEMINI_API_KEY=your_gemini_key
VAPID_PUBLIC_KEY=your_vapid_public
VAPID_PRIVATE_KEY=your_vapid_private
```
Start the backend:
```bash
npm start
# Runs on localhost:8080
```

### 3. Setup Frontend (`/client`)
Open a new terminal:
```bash
cd client
npm install
npm run dev
# Runs on localhost:5173
```

## 🌐 Deployment

- Frontend Deployed on [Vercel](https://vercel.com/)
- Backend Deployed on [Render](https://render.com/)
- Database hosted with MongoDB Atlas

## 📖 Usage

- **Browse Blogs:** See all published blogs on the home page.
- **Write a Blog:** Sign up/log in and click "Write" to create a new blog. Choose manual writing or use AI.
- **AI Generation:** Enter a topic, select tone, length, and format, then click "Generate Content".
- **Edit & Manage:** Edit or delete your blogs from the dashboard.
- **Profile:** Manage your user profile and settings.
- **Intractive Social features:** likes,reviews,follow
- **Read Aloud:** Click the “Read Aloud” button on any blog post to have it spoken aloud.

## 🌐 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/blogs` | Get all blogs (filtered/paginated) |
| `POST` | `/blogs` | Create a new blog |
| `GET` | `/blogs/:id` | Get details of a blog |
| `POST` | `/blogs/ai/generate` | Generate content using AI |
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Authenticate user |
| `GET` | `/notifications` | Get user notifications |

## 💬 Support

Created by [Nimish Kumar](https://www.linkedin.com/in/nimishkumar07/).

---

© RapidPost. All rights reserved. Powered by AI technology and real-time notifications.