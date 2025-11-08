import express from "express";
 
import { addProduct, listproduct, removeProduct, singleProduct } from "../controllers/productControllers.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router()

// Accept either a repeated "image" field or specific image1..image4 fields
productRouter.post(
	'/add',
	adminAuth,
	upload.fields([
		{ name: 'image', maxCount: 4 },
		{ name: 'image1', maxCount: 1 },
		{ name: 'image2', maxCount: 1 },
		{ name: 'image3', maxCount: 1 },
		{ name: 'image4', maxCount: 1 },
	]),
	addProduct
)
productRouter.get('/list', listproduct)
productRouter.post('/remove', removeProduct)
productRouter.post('/single', singleProduct)

export default productRouter
