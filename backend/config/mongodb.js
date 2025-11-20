import mongoose from "mongoose";

const connectDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB already connected");
        return;
    }

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`, {
        serverSelectionTimeoutMS: 5000,
    });
}

export default connectDB;