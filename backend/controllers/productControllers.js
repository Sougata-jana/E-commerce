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

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      price: Number(price),
      description,
      category,
      subCategory,
      size: JSON.parse(size),
      bestSeller: bestSeller === true ? true : false,
      image: imageUrl,
      date: Date.now(),
    };

    console.log(productData);

    const product = new produCtModel(productData);
    await product.save();

    res.json({ message: "product added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
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
