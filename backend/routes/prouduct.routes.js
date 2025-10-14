import express from "express";
 
import { addProduct, listproduct, removeProduct, singleProduct } from "../controllers/productControllers.js";
import upload from "../middleware/multer.js";

const productRouter = express.Router()

productRouter.post('/add',upload.fields([{name:'image1', maxcount:1},{name:'image2', maxcount:1},{name:'image3', maxcount:1},{name:'image4', maxcount:1}]), addProduct)
productRouter.get('/list', listproduct)
productRouter.post('/remove', removeProduct)
productRouter.post('/single', singleProduct)

export default productRouter
