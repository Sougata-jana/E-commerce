import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, please login again",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set");
    return res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid token",
    });
  }
};

export default authUser;
