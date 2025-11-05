import React, { useEffect, useState } from "react";
import { backendUrl, rupee } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

function OrderProduct({ token }) {
  const [orders, setOrders] = useState([]);
  if (!token) {
    return null;
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      // Debug: print fetched orders to console for inspection
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(
          "Failed to fetch orders: " +
            (response.data.message || "Unknown error")
        );
      }
      console.log("Orders fetched:", response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const statusHandeler = async (event, orderId) =>{
    try {
      const status = String(event.target.value).toLowerCase();
      // Optimistically update UI so the select reflects immediately
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status },
        { headers : { token, 'Content-Type': 'application/json' } }
      )
      console.log('Status update response:', response.status, response.data)
      if(response.data && response.data.success){
        // Ensure we are in sync with the database
        await fetchOrders()
      } else {
        toast.error((response.data && response.data.message) || 'Failed to update status')
      }
    } catch (error) {
      console.log('Status update error:', error?.response?.status, error?.response?.data || error);
      toast.error(error?.response?.data?.message || error.message)
      
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold text-gray-900">Manage Orders</h3>
      <div className="bg-white rounded-xl border shadow-sm divide-y">
        {orders.map((order, index) => (
          <div key={index} className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-gray-50/60">
            <img src={assets.parcel_icon} alt="parcel" className="md:col-span-1 w-12 h-12 rounded-lg border bg-gray-50 p-2" />
            <div className="md:col-span-6 min-w-0">
              <div className="text-sm text-gray-700 leading-relaxed">
              {order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return (
                    <p key={index} className="inline">
                      {item.name} x {item.quantity} <span>{item.size}</span>{" "}
                    </p>
                  );
                } else {
                  return (
                    <p key={index} className="inline after:content-[',\00a0']">
                      {item.name} x {item.quantity} <span>{item.size}</span>{" "}
                    </p>
                  );
                }
              })}
            </div>
            <p className="mt-1 font-medium text-gray-900">{order.address.fullName}</p>
            <div className="text-sm text-gray-600">
              <p className="inline">{order.address.address + ", " }</p>
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
            onChange={(event)=> statusHandeler(event,order._id)}
            value={(order.status || 'placed').toLowerCase()}
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
