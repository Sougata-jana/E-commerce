// placing orders using COD Method

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount } = req.body;
    const address = req.body.address || req.body.shippingAddress;

    if (!userId || !Array.isArray(items) || items.length === 0 || !address || typeof amount !== 'number') {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      status: "placed",
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.status(201).json({ success: true, message: "Order placed successfully", orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// placing orders using stripe Mthod
const placeOrderStripe = async (req, res) => {};

// placing orders using phonePe Method
const placeOrderPhonePe = async (req, res) => {};
// All Orders data foe Admin panel
const allOrders = async (req, res) => {

};

// User order Data For Fontend
const userOrders = async (req, res) => {
        try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error);
    res.status(500).json({ message: "Internal server error" });
    }
};

// Update order status by Admin
const updateOrderStatus = async (req, res) => {};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderPhonePe,
  allOrders,
  userOrders,
  updateOrderStatus,
};
