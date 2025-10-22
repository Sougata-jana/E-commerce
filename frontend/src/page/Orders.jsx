import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Orders() {
  const navigate = useNavigate()
  const orders = useMemo(() => {
    try {
      const raw = localStorage.getItem('orders')
      const list = raw ? JSON.parse(raw) : []
      // Ensure array and sort by createdAt desc
      return Array.isArray(list)
        ? [...list].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        : []
    } catch {
      return []
    }
  }, [])

  if (!orders.length) {
    return (
      <div className='max-w-3xl mx-auto px-6 lg:px-12 my-12 text-center'>
        <h1 className='text-2xl font-semibold'>My Orders</h1>
        <p className='mt-2 text-gray-600'>You don't have any orders yet.</p>
        <Link to='/collection' className='inline-block mt-6 px-4 py-2 rounded-full bg-black text-white hover:opacity-90'>Shop now</Link>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto px-6 lg:px-10 my-8'>
      <h1 className='text-xl font-semibold mb-4'>My Orders</h1>
      <div className='bg-white rounded-xl overflow-hidden shadow-sm divide-y'>
        {orders.map((order) => {
          const first = order.items?.[0]
          const date = new Date(order.createdAt)
          const pretty = date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
          const qty = order.items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0
          const price = order.totals?.grandTotal ?? 0
          return (
            <div key={order.id} className='p-4 sm:p-5 flex items-center gap-4'>
              <div className='w-16 h-16 rounded border overflow-hidden bg-white'>
                {first?.image ? (
                  <img src={first.image} alt={first?.name || 'Order image'} className='w-full h-full object-contain' />
                ) : (
                  <div className='w-full h-full bg-gray-100' />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-medium text-gray-900 line-clamp-1'>{first?.name || 'Order'}</div>
                <div className='mt-1 text-xs text-gray-600 flex flex-wrap items-center gap-3'>
                  <span>${price}</span>
                  <span>Quantity: {qty}</span>
                  {first?.size ? <span>Size: {first.size}</span> : null}
                  <span className='text-gray-500'>Date: {pretty}</span>
                </div>
              </div>
              <div className='hidden sm:flex items-center gap-2 text-emerald-600'>
                <span className='inline-block h-2 w-2 bg-emerald-500 rounded-full' />
                <span className='text-sm'>Ready to ship</span>
              </div>
              <div className='ms-auto'>
                <button
                  onClick={() => navigate(`/order/${encodeURIComponent(order.id)}`, { state: { order } })}
                  className='px-3 py-2 rounded-full border border-gray-300 hover:border-black text-sm'
                >
                  Track Order
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders
