import { placeOrder, placeOrderStripe, placeOrderPhonePe, allOrders, userOrders, updateOrderStatus}from "../controllers/orderControllers.js";
import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";


const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list',adminAuth, allOrders)
orderRouter.post('/status',adminAuth, updateOrderStatus)
// Payment Features
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/stripe',authUser, placeOrderStripe)
orderRouter.post('/phonepe',authUser, placeOrderPhonePe)

// User Features
orderRouter.post('/userorders',authUser, userOrders)

export default orderRouter;