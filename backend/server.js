import express from "express";
import cors from "cors";
import 'dotenv/config'
import mongoose from "mongoose";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/prouduct.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";

//app config
const app = express()
const port = process.env.PORT || 4000

//middlewares
app.use(express.json())
app.use(cors())

// MongoDB connection with caching for serverless
let cachedDb = null;
const connectDB = async () => {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }
    
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`, {
            serverSelectionTimeoutMS: 5000,
        });
        cachedDb = db;
        console.log("MongoDB connected");
        return db;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

// Initialize Cloudinary
connectCloudinary();

// API requests
app.get('/', async (req, res)=>{
    try {
        await connectDB();
        res.send("API Working")
    } catch (error) {
        res.status(500).send("Database connection error")
    }
})

//api endpoints
app.use('/api/user', async (req, res, next) => {
    await connectDB();
    next();
}, userRouter)

app.use('/api/product', async (req, res, next) => {
    await connectDB();
    next();
}, productRouter)

app.use('/api/cart', async (req, res, next) => {
    await connectDB();
    next();
}, cartRouter)

app.use('/api/order', async (req, res, next) => {
    await connectDB();
    next();
}, orderRouter)

// Only start server when not in Vercel
if (!process.env.VERCEL) {
    app.listen(port, ()=> console.log("server Started at port :" + port))
}

// Export for Vercel serverless
export default app;