if (process.env.NODE_ENV != "production") {
    'dotenv/config'
}

import 'dotenv/config'
import express from 'express'
const app = express()
import { createServer } from 'http'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import methodOverride from 'method-override'
import blogRouter from './routes/blog.js'
import reviewRouter from './routes/review.js'
import userRouter from "./routes/user.js"
import likeRouter from './routes/like.js'
import savedRouter from "./routes/saved.js";
import followRouter from './routes/follow.js'
import notificationRouter from './routes/notifications.js'
import cookieParser from 'cookie-parser'
import User from './models/user.js'
import Blog from './models/blog.js'

import moment from 'moment'
import { storage } from './cloudConfig.js'

// Create HTTP server and Socket.io instance
const server = createServer(app)
import { initSocket } from './socket.js'
const io = initSocket(server)

const dbUrl = process.env.ATLASDB_URL

const upload = multer({ storage })

main()
    .then(() => {
        console.log("connected to DB")
    }).catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect(dbUrl)
}


import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//middlewares
app.use(cors({
    origin: ["https://rapidpost.live",
        "https://www.rapidpost.live"],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(cookieParser())

app.locals.moment = moment


// Sessions migrated to JWT logic

app.get('/', (req, res) => {
    res.send("Hi, I am root")
})

// Dynamic Sitemap Generation for SEO
app.get('/sitemap.xml', async (req, res) => {
    try {
        const blogs = await Blog.find({}, '_id updatedAt createdAt').sort({ createdAt: -1 });
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Static URLs
        xml += '  <url>\n';
        xml += '    <loc>https://www.rapidpost.live/</loc>\n';
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';
        
        // Dynamic Blog URLs
        blogs.forEach(blog => {
            xml += '  <url>\n';
            xml += `    <loc>https://www.rapidpost.live/blogs/${blog._id}</loc>\n`;
            if (blog.updatedAt || blog.createdAt) {
                const date = blog.updatedAt || blog.createdAt;
                xml += `    <lastmod>${new Date(date).toISOString().split('T')[0]}</lastmod>\n`;
            }
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
        });
        
        xml += '</urlset>';
        
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

app.set('trust proxy', 1); // Trust the proxy (Render load balancer)

app.use((req, res, next) => {
    req.io = io // Make io available in all routes
    next()
})

// DEBUG: Global Request Logger
app.use((req, res, next) => {
    console.log(`[SERVER] ${req.method} ${req.path}`);
    next();
});



app.use("/blogs/:id/reviews", reviewRouter)
app.use("/blogs", blogRouter)
app.use("/blogs", likeRouter)
app.use("/", userRouter)
app.use("/", savedRouter)
app.use("/users", followRouter)
app.use("/notifications", notificationRouter)


app.use((err, req, res, next) => {
    let { statusCode = 404, message = "Something went wrong" } = err
    res.status(statusCode).send(message)

})



// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.emit('welcome', `Hello ${socket.id}`);

    // Handle user authentication and room joining
    socket.on('authenticate', (userId) => {
        try {
            if (userId && typeof userId === 'string') {
                socket.join(`user_${userId}`);
                socket.userId = userId; // Store userId on socket for later use
                console.log(`User ${userId} joined their notification room`);
                socket.emit('room_joined', `user_${userId}`);
            } else {
                console.warn('Invalid userId provided for authentication:', userId);
            }
        } catch (error) {
            console.error('Error during socket authentication:', error);
        }
    });

    // Handle joining blog post rooms for real-time comments
    socket.on('join_blog', (blogId) => {
        if (blogId) {
            const roomName = `blog_${blogId}`;
            socket.join(roomName);
            console.log(`[Socket] ${socket.id} joined room ${roomName} (blogId type: ${typeof blogId})`);
        } else {
            console.warn(`[Socket] ${socket.id} attempted to join blog with null/undefined ID`);
        }
    });

    socket.on('leave_blog', (blogId) => {
        if (blogId) {
            const roomName = `blog_${blogId}`;
            socket.leave(roomName);
            console.log(`[Socket] ${socket.id} left room ${roomName}`);
        }
    });

    socket.on('disconnect', (reason) => {
        console.log('User disconnected:', socket.id, 'Reason:', reason);
        if (socket.userId) {
            console.log(`User ${socket.userId} left their notification room`);
        }
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });
});

const PORT = process.env.PORT || 8080

import notificationCleanupService from './services/notificationCleanup.js';


server.listen(PORT, () => {
    console.log("server is running on " + PORT)

    // Schedule notification cleanup to run once a day (24 hours)
    setInterval(() => {
        notificationCleanupService.scheduleCleanup()
            .catch(err => console.error("Notification cleanup failed", err));
    }, 24 * 60 * 60 * 1000);

    // Run once on startup to clean old data immediately
    // notificationCleanupService.scheduleCleanup(); 
})

export { app, io };