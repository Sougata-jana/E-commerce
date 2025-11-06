import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext.jsx";
import axios from "axios";

function Orders() {
  const { backendUrl, token } = useContext(shopContext); // Removed 'price' as it's not used here
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  // --- Data Transformation (kept as is, it's robust) ---
  const flatItems = useMemo(() => {
    const out = [];
    for (const o of orderData || []) {
      const orderId = o._id || o.id;
      const created = o.createdAt || (o.date ? new Date(o.date).toISOString() : new Date().toISOString());
      const items = Array.isArray(o.items) ? o.items : [];
      for (let idx = 0; idx < items.length; idx++) {
        const it = items[idx] || {};
        const img = Array.isArray(it.image) ? it.image[0] : it.image;
        out.push({
          order: o,
          orderId,
          created,
          itemIndex: idx,
          id: it._id || `${orderId}-${idx}`,
          name: it.name,
          size: it.size,
          quantity: it.quantity || 1,
          image: img,
          price: typeof it.unitDiscounted === 'number' ? it.unitDiscounted : (typeof it.price === 'number' ? it.price : undefined),
          // Ensure order status is passed through
          status: o.status || 'Processing' 
        });
      }
    }
    return out;
  }, [orderData]);
  // ---------------------------------------------------

  // --- Data Fetching ---
  const fetchOrders = async () => {
    try {
      if (!token) {
        // Redirect to login if no token, or handle silently if desired
        navigate('/login'); // Example: redirect to login
        return;
      }
      const res = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setOrderData(res.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      // Handle error (e.g., show a toast notification)
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, navigate, backendUrl]); // Added navigate and backendUrl to dependency array

  // --- Empty State UI ---
  if (!flatItems.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-white rounded-2xl shadow-xl my-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">No Orders Yet!</h1>
        <p className="text-lg text-gray-700 mb-8">
          It looks like you haven't placed any orders with us.
        </p>
        <p className="text-md text-gray-600 mb-8">
            Start exploring our amazing collection and find something you'll love!
        </p>
        <Link
          to="/collection"
          className="inline-block px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  // --- Orders List UI ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Your Recent Orders</h1>
      
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 divide-y divide-gray-200">
        {flatItems.map((row) => {
          const date = new Date(row.created);
          const prettyDate = date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
          
          // Determine status color
          let statusColorClass = 'bg-gray-100 text-gray-700';
          let statusText = row.status.toString().replace(/(^|\s)\S/g, l => l.toUpperCase());

          if (row.status.toLowerCase() === 'placed') {
            statusColorClass = 'bg-blue-100 text-blue-700';
          } else if (row.status.toLowerCase() === 'processing') {
            statusColorClass = 'bg-yellow-100 text-yellow-700';
          } else if (row.status.toLowerCase() === 'shipped') {
            statusColorClass = 'bg-emerald-100 text-emerald-700';
          } else if (row.status.toLowerCase() === 'delivered') {
            statusColorClass = 'bg-green-100 text-green-700';
          } else if (row.status.toLowerCase() === 'cancelled') {
            statusColorClass = 'bg-red-100 text-red-700';
          }

          return (
            <div key={`${row.orderId}-${row.id}-${row.itemIndex}`} className="p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {/* Product Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg border border-gray-200 overflow-hidden bg-white flex items-center justify-center shadow-sm">
                {row.image ? (
                  <img src={row.image} alt={row.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${row.id}`} className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition duration-200 line-clamp-1 mb-1">
                  {row.name || 'Item Name Not Available'}
                </Link>
                <div className='text-md text-gray-700 mb-2'>
                  <span className="font-medium">{row.price ? `$${row.price.toFixed(2)}` : 'Price N/A'}</span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span>Qty: {row.quantity}</span>
                  {row.size && (
                    <>
                      <span className="mx-2 text-gray-400">|</span>
                      <span>Size: {row.size}</span>
                    </>
                  )}
                </div>
                <div className='flex flex-wrap items-center gap-3 text-sm'>
                  <span className='text-gray-500'>Order Date: {prettyDate}</span>
                  <span className="h-1 w-1 bg-gray-300 rounded-full"></span> {/* Small dot separator */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusColorClass}`}>
                    {statusText}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="sm:ml-auto flex-shrink-0 mt-4 sm:mt-0">
                <button
                  onClick={() =>
                    navigate(`/order/${encodeURIComponent(row.orderId)}`,
                      { state: { order: row.order, selectedItemIndex: row.itemIndex } }
                    )
                  }
                  className="px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-800 font-medium hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md transition duration-300 text-base"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;