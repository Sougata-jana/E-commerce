import React, { useEffect, useState } from "react";
import { backendUrl, rupee } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

function OrderProduct({ token }) {
  const [orders, setOrders] = useState([]);

  if (!token) return null;

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      console.log("Orders fetched response:", response.data);
      if (response.data && response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(
          "Failed to fetch orders: " + (response.data?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  // Normalizes status so it matches option values
  const normalizeStatus = (s) => {
    if (!s) return "placed";
    return String(s).trim().toLowerCase();
  };

  const statusHandeler = async (event, orderId) => {
    const rawStatus = event.target.value;
    const status = normalizeStatus(rawStatus);
    console.log("Attempt change status ->", orderId, status);

    // Optimistic update (show change immediately)
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    );

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status },
        { headers: { token } }
      );

      console.log("status API response:", response.data);

      if (response.data && response.data.success) {
        // backend success — optionally re-fetch to get authoritative data
        // await fetchOrders();
        toast.success("Order status updated");
      } else {
        // Backend returned success: false — rollback optimistic update and show error
        await fetchOrders();
        toast.error("Could not update status: " + (response.data?.message || ""));
      }
    } catch (error) {
      console.error("Error updating status:", error.response || error);
      // rollback optimistic update on error
      await fetchOrders();
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold text-gray-900">Manage Orders</h3>
      <div className="bg-white rounded-xl border shadow-sm divide-y">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-gray-50/60"
          >
            <img
              src={assets.parcel_icon}
              alt="parcel"
              className="md:col-span-1 w-12 h-12 rounded-lg border bg-gray-50 p-2"
            />
            <div className="md:col-span-6 min-w-0">
              <div className="text-sm text-gray-700 leading-relaxed">
                {order.items.map((item, idx) => {
                  const isLast = idx === order.items.length - 1;
                  return (
                    <p key={idx} className={`inline ${!isLast ? "after:content-[',a0']" : ""}`}>
                      {item.name} x {item.quantity} <span>{item.size}</span>{" "}
                    </p>
                  );
                })}
              </div>
              <p className="mt-1 font-medium text-gray-900">{order.address.fullName}</p>
              <div className="text-sm text-gray-600">
                <p className="inline">{order.address.address + ", "}</p>
                <span className="inline">{order.address.city + ", " + order.address.state + ", " + order.address.pincode}</span>
              </div>
              <p className="text-sm text-gray-500">{order.address.phone}</p>
            </div>

            <div className="md:col-span-3 grid grid-cols-2 gap-3 text-sm">
              <p className="text-gray-500">Items <span className="block font-medium text-gray-900">{order.items.length}</span></p>
              <p className="text-gray-500">Method <span className="block font-medium text-gray-900">{order.paymentMethod}</span></p>
              <p className="text-gray-500">Payment <span className={`block font-medium ${order.payment ? 'text-green-700' : 'text-amber-700'}`}>{order.payment ? 'Done' : 'Pending'}</span></p>
              <p className="text-gray-500">Date <span className="block font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</span></p>
            </div>

            <p className="md:col-span-1 font-semibold text-gray-900">{rupee}{order.amount}</p>

            <select
              onChange={(event) => statusHandeler(event, order._id)}
              value={normalizeStatus(order.status)}
              className="md:col-span-1 border rounded-md px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="placed">Placed</option>
              <option value="packing">Packing</option>
              <option value="shipped">Shipped</option>
              <option value="out for delivery">Out for delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderProduct;
