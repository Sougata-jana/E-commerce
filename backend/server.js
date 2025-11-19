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
connectDB()
connectCloudinary()


//middlewares
app.use(express.json())
app.use(cors())

// API requests
app.get('/', (req, res)=>{
    res.send("API Working")
})

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter )
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.listen(port, ()=> console.log("server Started at port :" + port)
)

// Export for Vercel serverless
export default app;