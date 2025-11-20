import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/prouduct.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";

//app config
const app = express()
const port = process.env.PORT || 4000

// Cache for serverless connections
let cachedDb = null;

// Middleware to ensure connections are initialized
const ensureConnection = async (req, res, next) => {
    if (!cachedDb) {
        try {
            await connectDB();
            await connectCloudinary();
            cachedDb = true;
        } catch (error) {
            console.error("Connection error:", error);
            return res.status(500).json({ success: false, message: "Database connection failed" });
        }
    }
    next();
};

//middlewares
app.use(express.json())
app.use(cors())
app.use(ensureConnection)

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
if (process.env.VERCEL !== '1') {
    app.listen(port, ()=> console.log("server Started at port :" + port))
}

// Export for Vercel serverless
export default app;