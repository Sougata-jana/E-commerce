import express from 'express';

import { addToCart,getCart,updateCart } from '../controllers/cartContrllers.js';
import authUser from '../middleware/auth.js';

const cartRouter = express.Router()

cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update',authUser,  updateCart)
cartRouter.post('/get', authUser, getCart)

export default cartRouter