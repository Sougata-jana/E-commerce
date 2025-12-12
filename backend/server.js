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
let cachedConnection = null;

const connectDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log("Using existing MongoDB connection");
        return mongoose.connection;
    }
    
    // If connection is in progress, wait for it
    if (mongoose.connection.readyState === 2) {
        console.log("MongoDB connection in progress, waiting...");
        return new Promise((resolve, reject) => {
            mongoose.connection.once('connected', () => resolve(mongoose.connection));
            mongoose.connection.once('error', reject);
            // Timeout after 10 seconds
            setTimeout(() => reject(new Error("Connection timeout")), 10000);
        });
    }
    
    // Check if we have a cached connection promise
    if (cachedConnection) {
        console.log("Waiting for cached connection...");
        return cachedConnection;
    }
    
    // Validate environment variable
    if (!process.env.MONGODB_URI) {
        const error = new Error("MONGODB_URI environment variable is not set. Please add it in Vercel project settings.");
        console.error(error.message);
        throw error;
    }
    
    // Create connection promise and cache it
    cachedConnection = (async () => {
        try {
            const mongoUri = process.env.MONGODB_URI;
            
            // Ensure URI doesn't already have /ecommerce
            const dbUri = mongoUri.endsWith('/ecommerce') 
                ? mongoUri 
                : `${mongoUri}/ecommerce`;
            
            console.log("Connecting to MongoDB...");
            
            await mongoose.connect(dbUri, {
                serverSelectionTimeoutMS: 15000,
                socketTimeoutMS: 45000,
                maxPoolSize: 1, // Important for serverless
                minPoolSize: 1,
                bufferCommands: false,
                bufferMaxEntries: 0,
            });
            
            console.log("MongoDB connected successfully");
            
            // Handle connection events
            mongoose.connection.on('error', (err) => {
                console.error("MongoDB connection error:", err);
                cachedConnection = null;
            });
            
            mongoose.connection.on('disconnected', () => {
                console.log("MongoDB disconnected");
                cachedConnection = null;
            });
            
            return mongoose.connection;
        } catch (error) {
            console.error("MongoDB connection error:", error);
            cachedConnection = null; // Reset cache on error
            throw error;
        }
    })();
    
    return cachedConnection;
};

// Initialize Cloudinary
connectCloudinary();

//middlewares
app.use(express.json())
app.use(cors())

// Health check endpoint (attempts DB connection)
app.get('/', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    // Try to connect if not connected
    let dbError = null;
    if (dbStatus === "disconnected") {
        try {
            await connectDB();
        } catch (error) {
            dbError = error.message;
            console.error("Health check DB connection failed:", error);
        }
    }
    
    const finalDbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    res.json({
        message: "API Working",
        status: "ok",
        database: finalDbStatus,
        timestamp: new Date().toISOString(),
        ...(dbError && { 
            dbError: dbError,
            hint: "Check MONGODB_URI in Vercel settings and MongoDB Atlas network access"
        })
    });
});

// Middleware to ensure DB connection before handling requests (for serverless)
// Skip DB check for root endpoint
app.use(async (req, res, next) => {
    // Skip database connection for root endpoint
    if (req.path === '/' || req.path === '/api/health') {
        return next();
    }
    
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        
        // Provide helpful error message
        let errorMessage = "Database connection failed. Please try again later.";
        let errorDetails = null;
        
        if (error.message.includes("MONGODB_URI")) {
            errorMessage = "MongoDB configuration error. Please check environment variables in Vercel settings.";
            errorDetails = "MONGODB_URI is not set";
        } else if (error.message.includes("authentication failed")) {
            errorMessage = "MongoDB authentication failed. Please check your connection string.";
        } else if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
            errorMessage = "Cannot reach MongoDB server. Please check your connection string and network access.";
        }
        
        res.status(503).json({ 
            success: false, 
            message: errorMessage,
            error: error.message, // Always show error message for debugging
            ...(errorDetails && { details: errorDetails })
        });
    }
});

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