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

// Initialize connections once
let isConnected = false;

async function initializeConnections() {
    if (!isConnected) {
        await connectDB()
        await connectCloudinary()
        isConnected = true;
    }
}

//middlewares
app.use(express.json())
app.use(cors())

// API requests
app.get('/', async (req, res)=>{
    await initializeConnections();
    res.send("API Working")
})

//api endpoints
app.use('/api/user', async (req, res, next) => {
    await initializeConnections();
    next();
}, userRouter)

app.use('/api/product', async (req, res, next) => {
    await initializeConnections();
    next();
}, productRouter)

app.use('/api/cart', async (req, res, next) => {
    await initializeConnections();
    next();
}, cartRouter)

app.use('/api/order', async (req, res, next) => {
    await initializeConnections();
    next();
}, orderRouter)

// Only call app.listen() when NOT in serverless environment
if (process.env.VERCEL !== '1') {
    initializeConnections().then(() => {
        app.listen(port, ()=> console.log("server Started at port :" + port))
    });
}

// Export for Vercel serverless
export default app;