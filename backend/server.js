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

// MongoDB connection with caching for serverless
let isConnected = false;

const connectDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        return;
    }
    
    // If connection is in progress, wait for it
    if (mongoose.connection.readyState === 2) {
        return new Promise((resolve, reject) => {
            mongoose.connection.once('connected', resolve);
            mongoose.connection.once('error', reject);
        });
    }
    
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        
        await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        isConnected = false;
        throw error;
    }
};

// Initialize Cloudinary
connectCloudinary();

//middlewares
app.use(express.json())
app.use(cors())

// Middleware to ensure DB connection before handling requests (for serverless)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(503).json({ 
            success: false, 
            message: "Database connection failed. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API requests
app.get('/', (req, res)=>{
    res.send("API Working")
})

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Only start server when not in Vercel
if (!process.env.VERCEL) {
    // Initialize connections on startup for local development
    connectDB().catch(console.error);
    app.listen(port, ()=> console.log("server Started at port :" + port))
}

// Export for Vercel serverless
export default app;