// placing orders using COD Method

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

//? global variable

const currency = "inr";
const deliveryCharges = 40;

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

if (!stripeSecret) {
  console.warn(
    "STRIPE_SECRET_KEY is not set. Stripe checkout endpoints will return 503 until it is configured."
  );
}

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount } = req.body;
    const address = req.body.address || req.body.shippingAddress;

    if (
      !userId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !address ||
      typeof amount !== "number"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
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
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// placing orders using stripe Mthod
const placeOrderStripe = async (req, res) => {
  try {
    if (!stripe) {
      return res
        .status(503)
        .json({ success: false, message: "Stripe is not configured" });
    }

    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      status: "pending",
      paymentMethod: "stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// verify payment and update order status

const varifyPayment = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    const userId = req.body.userId || req.body.userID;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "placed" });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findByIdAndUpdate(orderId, { status: "cancelled", payment: false });
      res
        .status(200)
        .json({
          success: false,
          message: "Payment verification failed, order cancelled",
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// placing orders using phonePe Method
const placeOrderPhonePe = async (req, res) => {};
// All Orders data foe Admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
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
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res
      .status(200)
      .json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  varifyPayment,
  placeOrderPhonePe,
  allOrders,
  userOrders,
  updateOrderStatus,
};
