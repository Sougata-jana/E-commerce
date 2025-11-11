import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
    const cloud_name = process.env.CLOUDINARY_NAME || process.env.CLOUINARY_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUINARY_API_SECRET;

    if (!cloud_name || !api_key || !api_secret) {
        console.warn(
            "Cloudinary env vars missing. Ensure CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET are set."
        );
    }

    cloudinary.config({ cloud_name, api_key, api_secret });
};

export default connectCloudinary;