import React, { useEffect, useState } from "react";
import { backendUrl } from "../App"; // Assuming rupee is also imported from App
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

// Placeholder for rupee symbol if not globally available
const rupee = "₹";

function OrderProduct({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data && response.data.success) {
        setOrders(response.data.orders || []);
        toast.success("Orders loaded successfully!"); // Optional: give feedback
      } else {
        setError(response.data?.message || "Unknown error fetching orders.");
        toast.error("Failed to fetch orders: " + (response.data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Network error or server issue. Please try again.");
      toast.error("Failed to fetch orders due to a network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false); // No token, so not loading
      setError("Authentication token missing. Please log in.");
    }
  }, [token]);

  // --- Status Normalization ---
  const normalizeStatus = (s) => {
    return String(s || "placed").trim().toLowerCase();
  };

  // --- Status Update Handler ---
  const statusHandeler = async (event, orderId) => {
    const newStatus = normalizeStatus(event.target.value);
    const originalOrders = [...orders]; // Capture original state for rollback

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.info(`Updating status to "${newStatus}"...`);

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data && response.data.success) {
        toast.success(`Order status updated to "${newStatus}"`);
        // Optionally re-fetch to ensure data consistency, or rely on optimistic update
        // fetchOrders();
      } else {
        // Rollback on backend failure
        setOrders(originalOrders);
        toast.error("Could not update status: " + (response.data?.message || ""));
      }
    } catch (err) {
      console.error("Error updating status:", err.response || err);
      // Rollback on network/server error
      setOrders(originalOrders);
      toast.error("Error updating status due to a network issue.");
    }
  };

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h3 className="text-3xl font-semibold text-gray-900 mb-4">Loading Orders...</h3>
        <p className="text-gray-600">Please wait while we fetch the latest orders.</p>
        <div className="flex justify-center items-center mt-8">
          {/* Simple loading spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // --- Error State UI ---
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-red-50 rounded-lg shadow-md border border-red-200">
        <h3 className="text-3xl font-semibold text-red-700 mb-4">Error Loading Orders</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-8 px-6 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --- Empty State UI ---
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-white rounded-2xl shadow-xl my-16">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-4">No Orders to Manage</h3>
        <p className="text-lg text-gray-700 mb-8">
          It looks like there are no new orders in the system.
        </p>
        <p className="text-md text-gray-600">
          Orders will appear here once customers start placing them.
        </p>
      </div>
    );
  }

  // --- Main Orders List UI ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h3 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Manage Customer Orders</h3>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 divide-y divide-gray-200">
        {orders.map((order) => {
          const orderDate = new Date(order.date);
          const formattedDate = orderDate.toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
          });

          // Helper to get status class
          const getStatusClass = (status) => {
            switch (normalizeStatus(status)) {
              case 'placed': return 'bg-blue-100 text-blue-700';
              case 'packing': return 'bg-yellow-100 text-yellow-700';
              case 'shipped': return 'bg-purple-100 text-purple-700';
              case 'out for delivery': return 'bg-orange-100 text-orange-700';
              case 'delivered': return 'bg-green-100 text-green-700';
              default: return 'bg-gray-100 text-gray-700';
            }
          };

          return (
            <div
              key={order._id}
              className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:bg-indigo-50/20 transition-colors duration-200"
            >
              {/* Parcel Icon */}
              <div className="md:col-span-1 flex justify-center items-center">
                <img
                  src={assets.parcel_icon}
                  alt="parcel"
                  className="w-16 h-16 rounded-xl border border-gray-200 bg-white p-3 shadow-md"
                />
              </div>

              {/* Order Items & Customer Address */}
              <div className="md:col-span-5 min-w-0">
                <div className="text-base text-gray-800 font-medium leading-relaxed mb-2">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x {item.quantity}{item.size && ` (${item.size})`}
                      {idx < order.items.length - 1 && ", "}
                    </span>
                  ))}
                </div>
                <p className="font-semibold text-gray-900 text-lg mb-1">{order.address.fullName}</p>
                <div className="text-sm text-gray-600 leading-tight">
                  <p>{order.address.address}, {order.address.city}</p>
                  <p>{order.address.state}, {order.address.pincode}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Phone: {order.address.phone}</p>
              </div>

              {/* Order Summary Details */}
              <div className="md:col-span-3 grid grid-cols-2 gap-4 text-sm text-gray-500 border-l border-gray-200 pl-6 h-full py-2">
                <div>
                  <span className="block mb-1">Items</span>
                  <span className="block font-bold text-gray-900 text-base">{order.items.length}</span>
                </div>
                <div>
                  <span className="block mb-1">Method</span>
                  <span className="block font-bold text-gray-900 text-base">{order.paymentMethod}</span>
                </div>
                <div>
                  <span className="block mb-1">Payment</span>
                  <span className={`block font-bold text-base ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
                    {order.payment ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div>
                  <span className="block mb-1">Date</span>
                  <span className="block font-bold text-gray-900 text-base">{formattedDate}</span>
                </div>
              </div>
              
              {/* Order Total */}
              <div className="md:col-span-1 font-bold text-gray-900 text-xl text-center">
                {rupee}{order.amount.toFixed(2)}
              </div>

              {/* Status Selector */}
              <div className="md:col-span-2 flex flex-col items-end gap-3">
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusClass(order.status)}`}>
                    {normalizeStatus(order.status)}
                </span>
                <select
                  onChange={(event) => statusHandeler(event, order._id)}
                  value={normalizeStatus(order.status)}
                  className="w-full max-w-[180px] border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 cursor-pointer shadow-sm"
                >
                  <option value="placed">Placed</option>
                  <option value="packing">Packing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderProduct;