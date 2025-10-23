import userModel from "../models/userModel.js";

// add product to user cart
const addToCart = async (req, res) => {
  const [userId, itemId, size] = req.body;

  try {
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res
      .status(200)
      .json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// update user cart
const updateCart = async (req, res) => {
  const [userId, itemId, size, quantity] = req.body;
  try {
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    cartData[itemId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });
    res
      .status(200)
      .json({ success: true, message: "Cart updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get user cart
const getCart = async (req, res) => {

  try {
    const userData = await userModel.findById(userId)
     let cartData = userData.cartData;

    res.status(200).json({ success: true, cartData });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addToCart, updateCart, getCart };
