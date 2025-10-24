import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const shopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 40;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showsearch, setShowSearch] = useState(true);
  const [cartItem, setCartItem] = useState({});
  const [products, setProduct] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Add to cart: supports quantity and default size key
  const addCart = async (itemID, size = "default", quantity = 1) => {
    const qty =
      Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
    setCartItem((prev) => {
      const cartData = structuredClone(prev);
      if (!cartData[itemID]) cartData[itemID] = {};
      if (!cartData[itemID][size]) cartData[itemID][size] = 0;
      cartData[itemID][size] += qty;
      return cartData;
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemID, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to sync cart with server");
      }
    }
  };

  const decCart = async (itemID, size = "default", quantity = 1) => {
    const qty =
      Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
    // Compute new target quantity to send to backend
    const prevQty = cartItem?.[itemID]?.[size] || 0;
    const newQty = prevQty - qty;
    setCartItem((prev) => {
      const cartData = structuredClone(prev);
      if (!cartData[itemID] || !cartData[itemID][size]) return prev;
      cartData[itemID][size] -= qty;
      if (cartData[itemID][size] <= 0) delete cartData[itemID][size];
      if (Object.keys(cartData[itemID]).length === 0) delete cartData[itemID];
      return cartData;
    });
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemID, size, quantity: newQty },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to sync cart with server");
      }
    }
  };

  const removeCart = async (itemID, size = "default") => {
    setCartItem((prev) => {
      const cartData = structuredClone(prev);
      if (cartData[itemID] && cartData[itemID][size] != null) {
        delete cartData[itemID][size];
        if (Object.keys(cartData[itemID]).length === 0) delete cartData[itemID];
      }
      return cartData;
    });
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemID, size, quantity: 0 },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to sync cart with server");
      }
    }
  };

  const clearCart = () => setCartItem({});

  // Offer helpers
  const extractPercent = (raw) => {
    if (typeof raw === "number") return raw;
    if (raw == null) return null;
    const m = String(raw).match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : null;
  };

  const deriveStablePercent = (id) => {
    const s = String(id || "");
    let sum = 0;
    for (let i = 0; i < s.length; i++) sum = (sum + s.charCodeAt(i)) % 997;
    return 10 + (sum % 41); // 10..50
  };

  const getOfferPercentForProduct = (prod) => {
    if (!prod) return 0;
    const p = extractPercent(prod.offer);
    const percent = p == null || isNaN(p) ? deriveStablePercent(prod._id) : p;
    return Math.max(0, Math.min(90, percent));
  };

  const getDiscountedUnitPrice = (prod) => {
    if (!prod) return 0;
    const percent = getOfferPercentForProduct(prod);
    const price = Number(prod.price) || 0;
    return Math.round(price * (1 - percent / 100));
  };

  const getCartSubtotal = () => {
    // Original (without discount)
    let subtotal = 0;
    for (const id in cartItem) {
      const product = (products || []).find((p) => p._id === id);
      if (!product) continue;
      for (const size in cartItem[id]) {
        const qty = cartItem[id][size];
        subtotal += (Number(product.price) || 0) * qty;
      }
    }
    return subtotal;
  };

  const getCartSubtotalDiscounted = () => {
    // Discounted subtotal using offer percent
    let subtotal = 0;
    for (const id in cartItem) {
      const product = (products || []).find((p) => p._id === id);
      if (!product) continue;
      const unit = getDiscountedUnitPrice(product);
      for (const size in cartItem[id]) {
        const qty = cartItem[id][size];
        subtotal += unit * qty;
      }
    }
    return subtotal;
  };

  const getCartSavings = () => {
    const full = getCartSubtotal();
    const disc = getCartSubtotalDiscounted();
    return Math.max(0, full - disc);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  // Fetch and normalize products
  const getProductData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      const raw = Array.isArray(response.data)
        ? response.data
        : response.data?.products || [];
      const data = raw.map((p) => ({
        ...p,
        image: Array.isArray(p.image) ? p.image : p.image ? [p.image] : [],
        sizes: Array.isArray(p.sizes)
          ? p.sizes
          : Array.isArray(p.size)
          ? p.size
          : [],
        bestseller:
          typeof p.bestseller === "boolean" ? p.bestseller : !!p.bestSeller,
        bestSeller:
          typeof p.bestSeller === "boolean" ? p.bestSeller : !!p.bestseller,
      }));
      console.log("Products:", data);
      setProduct(data);
    } catch (error) {
      console.error(
        "Failed to load products:",
        error?.response?.data || error.message
      );
    }
  };


  const getCart = async (token) =>{
    try {
        
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if(response.data.success){
                setCartItem(response.data.cartData)
            }
        
    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
  }

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getCart(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showsearch,
    setShowSearch,
    cartItem,
    addCart,
    decCart,
    removeCart,
    clearCart,
    getCartSubtotal,
    getCartSubtotalDiscounted,
    getCartSavings,
    getOfferPercentForProduct,
    getDiscountedUnitPrice,
    getCartCount,
    navigate,
    backendUrl,
    token,
    setToken,
  };

  return (
    <shopContext.Provider value={value}>{props.children}</shopContext.Provider>
  );
};

export default ShopContextProvider;
