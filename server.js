if(process.env.NODE_ENV != "production"){
   'dotenv/config'
}

import express from'express'
const app = express()
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'
import multer from 'multer'
import path from 'path'
import methodOverride from 'method-override'
import blogRouter from './routes/blog.js'
import reviewRouter from './routes/review.js'
import userRouter from "./routes/user.js"
import likeRouter from './routes/like.js'
import savedRouter from "./routes/saved.js";
import followRouter from './routes/follow.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import flash from 'connect-flash'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import User from './models/user.js'
import ejsMate from 'ejs-mate'
import moment from 'moment'
import  {storage}  from './cloudConfig.js'

const dbUrl = process.env.ATLASDB_URL

const upload = multer({storage})

main()
.then(() => {
   console.log("connected to DB") 
}).catch((err) => {
    console.log(err)
});

async function main() {
    await mongoose.connect(dbUrl)
}

    // Simulate __dirname for ES Modules
        import { fileURLToPath } from 'url';
        import { dirname } from 'path';
        import { render } from 'ejs'
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);


//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

app.locals.moment=moment


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err)
})

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.get('/',(req,res)=>{
    res.send("Hi, I am root")
})


app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) // use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser =req.user
    next()
})




app.use("/blogs/:id/reviews",reviewRouter)
app.use("/",userRouter)
app.use("/blogs",likeRouter)
app.use("/", savedRouter);
app.use("/users",followRouter)
app.use("/blogs",blogRouter)


app.use((err,req,res,next)=>{
    let {statusCode=404,message="Something went wrong"} = err
    res.status(statusCode).send(message)
    
})



const PORT = process.env.PORT || 8080

app.listen(PORT, ()=>{
    console.log("server is running on "+ PORT)
})

export default app;