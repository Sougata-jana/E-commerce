import express from "express";
 
import { addProduct, listproduct, removeProduct, singleProduct } from "../controllers/productControllers.js";

const productRouter = express.Router()

productRouter.post('/add', addProduct)
productRouter.get('/list', listproduct)
productRouter.post('/remove', removeProduct)
productRouter.post('/single', singleProduct)

export default productRouter
