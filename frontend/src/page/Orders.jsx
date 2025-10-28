import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext.jsx";
import axios from "axios";

function Orders() {
  const { backendUrl, token, price } = useContext(shopContext);
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();
  
  // Flatten all order items into a single list for display
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
        });
      }
    }
    return out;
  }, [orderData]);

  const loaderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const res = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      setOrderData(res.data.orders || []);
    } catch (error) {}
  };

  useEffect(() => {
    loaderData();
  }, [token]);
  // const orders = useMemo(() => {
  //   try {
  //     const raw = localStorage.getItem('orders')
  //     const list = raw ? JSON.parse(raw) : []
  //     // Ensure array and sort by createdAt desc
  //     return Array.isArray(list)
  //       ? [...list].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  //       : []
  //   } catch {
  //     return []
  //   }
  // }, [])

  if (!flatItems.length) {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-12 my-12 text-center">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="mt-2 text-gray-600">You don't have any orders yet.</p>
        <Link
          to="/collection"
          className="inline-block mt-6 px-4 py-2 rounded-full bg-black text-white hover:opacity-90"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 my-8">
      <h1 className="text-xl font-semibold mb-4">My Orders</h1>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y">
        {flatItems.map((row) => {
          const date = new Date(row.created);
          const pretty = date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
          return (
            <div key={`${row.orderId}-${row.id}-${row.itemIndex}`} className="p-4 sm:p-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded border overflow-hidden bg-white">
                {row.image ? (
                  <img src={row.image} alt={row.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 line-clamp-1">{row.name || 'Item'}</div>
                <div className='mt-1 text-xs text-gray-600 flex flex-wrap items-center gap-3'>
                  <span>Size: {row.size || '-'}</span>
                  <span>Qty: {row.quantity}</span>
                  <span className='text-gray-500'>Date: {pretty}</span>
                  {/* Show order shipping/status instead of raw order id */}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${((row.order && row.order.status) || '').toLowerCase() === 'shipped' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {((row.order && row.order.status) || 'placed').toString().replace(/(^|\s)\S/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
              <div className="ms-auto">
                <button
                  onClick={() => navigate(`/order/${encodeURIComponent(row.orderId)}`, { state: { order: row.order } })}
                  className="px-3 py-2 rounded-full border border-gray-300 hover:border-black text-sm"
                >
                  Track Order
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
