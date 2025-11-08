import { v2 as cloudinary } from "cloudinary";
import { json } from "express";
import produCtModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      size,
      subCategory,
      bestSeller,
    } = req.body;

    // Coerce bestSeller from form-data string to boolean
    const bestSellerBool = (() => {
      if (typeof bestSeller === "boolean") return bestSeller;
      if (typeof bestSeller === "string") {
        const v = bestSeller.trim().toLowerCase();
        return v === "true" || v === "1" || v === "yes" || v === "on";
      }
      return false;
    })();

    // Support both 'image' (repeated) and individual 'image1'..'image4' fields
    const fx = (k) => (req.files && req.files[k] ? req.files[k] : []);
    const image1 = fx('image1')[0];
    const image2 = fx('image2')[0];
    const image3 = fx('image3')[0];
    const image4 = fx('image4')[0];
    const imageGroup = fx('image'); // array if sent as repeated field

    const images = [...imageGroup, image1, image2, image3, image4].filter(Boolean);

    if (!images.length) {
      return res.status(400).json({ success: false, message: "At least one product image is required." });
    }

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    let parsedSize = [];
    try {
      parsedSize = size ? JSON.parse(size) : [];
    } catch (e) {
      parsedSize = [];
    }

    const productData = {
      name,
      price: Number(price),
      description,
      category,
      subCategory,
      size: parsedSize,
      bestSeller: bestSellerBool,
      image: imageUrl,
      date: Date.now(),
    };

    console.log(productData);

    const product = new produCtModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: "Product added", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error?.message || "Internal server error" });
  }
};

// function for list product
const listproduct = async (req, res) => {
  try {
    const products = await produCtModel.find({});
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// function for remove product
const removeProduct = async (req, res) => {
  try {
    await produCtModel.findByIdAndDelete(req.body.id);
    res.json({ message: "product removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// function single product info

const singleProduct = async (req, res) => {
  try {
    const { productID } = req.body;
    const product = await produCtModel.findById(productID);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addProduct, listproduct, removeProduct, singleProduct };
