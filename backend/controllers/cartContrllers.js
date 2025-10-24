import userModel from "../models/userModel.js";

// Add product to user cart
const addToCart = async (req, res) => {
  // Support both itemID (frontend) and itemId (alternate)
  const { userId, itemID, itemId, size } = req.body;
  const pid = itemID || itemId;

  try {
    if (!userId || !pid || !size) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (cartData[pid]) {
      if (cartData[pid][size]) {
        cartData[pid][size] += 1;
      } else {
        cartData[pid][size] = 1;
      }
    } else {
      cartData[pid] = {};
      cartData[pid][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ success: true, message: "Product added to cart successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update user cart
const updateCart = async (req, res) => {
  const { userId, itemID, itemId, size, quantity } = req.body;
  const pid = itemID || itemId;

  try {
    if (!userId || !pid || !size || typeof quantity !== 'number') {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (!cartData[pid]) {
      return res.status(400).json({ success: false, message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // Remove the size entry and clean up empty product bucket
      if (cartData[pid] && cartData[pid][size] != null) {
        delete cartData[pid][size];
        if (Object.keys(cartData[pid]).length === 0) {
          delete cartData[pid];
        }
      }
    } else {
      cartData[pid][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ success: true, message: "Cart updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user cart
const getCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;
    res.status(200).json({ success: true, cartData });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addToCart, updateCart, getCart };
