import { json } from "express";
import jwt from "jsonwebtoken";


const authUser =  async (req, res, next) =>{
    const token  = req.headers

    if(!token){
        return res.status(401).json( {success:false,message: "Not authorized, please login again"} )
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
    } catch (error) {
        console.log(error);
        return res.status(401).
        res,json( {success:false,message: error.message} )
    }
}

export default authUser;