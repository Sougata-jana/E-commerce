import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponce.js";
// route of user login
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
const userLogin = async (req, res) => {
  try {
    const {email, password} = req.body;
    // Add 'await' here to get the actual user document
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found"); 
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      return res
        .status(200)
        .json(new ApiResponse(200, { token }, "User logged in successfully"));
      // res.json({ success: true, token });
    }else{
      throw new ApiError(400, "Invalid credentials");
      // res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in userLogin:", error);
    return res
      .status(error.statusCode || 500)
      // res.json({ success: false, message: error.message });
  }
};

// route of user register

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) throw new ApiError(400, "User already exists");

    if (!validator.isEmail(email)) throw new ApiError(400, "Invalid email");

    if (password.length < 8)
      throw new ApiError(400, "Password must be at least 8 characters long");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    console.log("User saved:", user);

    const token = createToken(user._id);
    console.log("Generated token:", token);

    return res
      .status(201)
      .json(new ApiResponse(201, { token }, "User registered successfully"));
  } catch (error) {
    console.error("Error in userRegister:", error);
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};
// route of Admin login
const adminLogin = async (req, res) => {
try {
    const { email, password}= req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email+password, process.env.JWT_SECRET)
      res.json({success:true, token})
    }else{
      throw new ApiError(400, "Invalid credentials")
    }
} catch (error) {
    console.error("Error in adminLogin:", error);
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
}
};

export { userLogin, userRegister, adminLogin };
