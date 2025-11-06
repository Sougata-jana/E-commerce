import React, { useContext, useEffect } from "react";
import { shopContext } from "../context/ShopContext.jsx";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Verify() {
  const { navigate, token, clearCart, backendUrl } = useContext(shopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) return; // wait for token to be available
      if (!orderId) {
        toast.error("Missing orderId");
        navigate("/cart");
        return;
      }
      const response = await axios.post(
        backendUrl + "/api/order/verifyStripe",
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        clearCart();
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment verification failed");
      navigate("/cart");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-gray-600">
      Verifying payment...
    </div>
  );
}

export default Verify;
