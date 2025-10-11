import userModel from "../models/userModel.js"
import { ApiError } from "../utils/apiError.js"
// route of user login
const userLogin = async (req, res)=>{

}

// route of user register

const userRegister = async (req,res)=>{
    const {name, email, password} = req.body
    try {
        // check if user already exists
        const exsits = await userModel.findOne({email});
        if(exsits){
            throw new ApiError(400, "user already exists")
        }
    } catch (error) {
        
    }
}
// route of Admin login
const adminLogin = async (req, res)=>{
    
}

export {userLogin, userRegister, adminLogin}