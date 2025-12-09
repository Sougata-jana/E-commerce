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
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }
    
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

// Initialize connections on startup
connectDB().catch(console.error);
connectCloudinary();

//middlewares
app.use(express.json())
app.use(cors())

// API requests
app.get('/', (req, res)=>{
    res.send("API Working")
})

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Only start server when not in Vercel
if (!process.env.VERCEL) {
    app.listen(port, ()=> console.log("server Started at port :" + port))
}

// Export for Vercel serverless
export default app;