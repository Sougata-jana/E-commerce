import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) =>{
    try {
        const {token} = req.headers
        if(!token){
            return res.status(401).json({success: false, message:"Unauthorized"})
        }
        
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set");
            return res.status(500).json({success: false, message: "Server configuration error"});
        }

        const token_decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.error("ADMIN_EMAIL or ADMIN_PASSWORD is not set");
            return res.status(500).json({success: false, message: "Server configuration error"});
        }
        
        if(token_decoded.id !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
            return res.status(401).json({success: false, message:"Unauthorized"})
        }
        next()

    } catch (error) {
        console.error("Error in adminAuth:", error);
        return res
      .status(401)
      .json({ success: false, message: "Unauthorized" });
    }
}

export default adminAuth