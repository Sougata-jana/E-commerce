import React, { useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

function Order() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const order = useMemo(() => {
    if (location.state?.order) return location.state.order
    try {
      // If an id param is provided, try to match from orders history
      const id = params.orderId
      const listRaw = localStorage.getItem('orders')
      const list = listRaw ? JSON.parse(listRaw) : []
      if (id && Array.isArray(list)) {
        const found = list.find(o => o.id === id)
        if (found) return found
      }
      // Fallback to lastOrder
      const raw = localStorage.getItem('lastOrder')
      if (raw) return JSON.parse(raw)
    } catch {}
    return null
  }, [location.state, params.orderId])

  if (!order) {
    return (
      <div className='max-w-3xl mx-auto px-6 lg:px-12 my-12 text-center'>
        <h1 className='text-2xl font-semibold'>No recent order</h1>
        <p className='mt-2 text-gray-600'>Looks like this page was opened directly.</p>
        <div className='mt-6 flex gap-3 justify-center'>
          <button onClick={() => navigate(-1)} className='px-4 py-2 rounded-full border border-gray-300 hover:border-black'>Go back</button>
          <Link to='/collection' className='px-4 py-2 rounded-full bg-black text-white hover:opacity-90'>Shop now</Link>
        </div>
      </div>
    )
  }

  const { id, createdAt, contact, shippingAddress, payment, items, totals } = order

  const steps = [
    { key: 'placed', label: 'Order placed', done: true },
    { key: 'processing', label: 'Processing', done: true },
    { key: 'shipped', label: 'Shipped', done: false },
    { key: 'out', label: 'Out for delivery', done: false },
    { key: 'delivered', label: 'Delivered', done: false },
  ]

  const printInvoice = () => window.print()

  return (
    <div className='max-w-6xl mx-auto px-6 lg:px-10 my-8'>
      {/* Header */}
      <div className='rounded-2xl overflow-hidden shadow-sm'>
        <div className='bg-gradient-to-r from-emerald-500 to-indigo-600 text-white p-6 sm:p-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex items-start gap-4'>
              <div className='shrink-0 mt-0.5'>
                <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-6 w-6'>
                    <path fillRule='evenodd' d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.29a.75.75 0 1 0-1.22-.92l-3.443 4.57-1.86-1.86a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.143-.094l4-5.25Z' clipRule='evenodd' />
                  </svg>
                </span>
              </div>
              <div>
                <h1 className='text-2xl font-semibold'>Order confirmed!</h1>
                <p className='mt-1 text-sm text-white/90'>Order <span className='font-semibold'>{id}</span> • {new Date(createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <button onClick={printInvoice} className='px-4 py-2.5 rounded-full bg-white text-gray-900 hover:opacity-90'>Print invoice</button>
              <Link to='/collection' className='px-4 py-2.5 rounded-full border border-white/70 hover:bg-white/10'>Continue shopping</Link>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className='bg-white p-6 sm:p-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Left column */}
            <div className='md:col-span-2 space-y-6'>
              {/* Status timeline */}
              <section className='rounded-xl border p-4 sm:p-5'>
                <h2 className='font-medium mb-3'>Status</h2>
                <ol className='relative border-s-2 border-dashed ps-4 space-y-4'>
                  {steps.map((s, idx) => (
                    <li key={s.key} className='group'>
                      <span className={`absolute -start-[11px] top-0 h-5 w-5 rounded-full flex items-center justify-center ${s.done ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {s.done ? (
                          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-3.5 w-3.5'>
                            <path fillRule='evenodd' d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.29a.75.75 0 1 0-1.22-.92l-3.443 4.57-1.86-1.86a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.143-.094l4-5.25Z' clipRule='evenodd' />
                          </svg>
                        ) : (
                          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='h-3.5 w-3.5'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M9 12l2 2 4-4' />
                          </svg>
                        )}
                      </span>
                      <div className='ms-4'>
                        <div className={`text-sm ${s.done ? 'text-gray-900' : 'text-gray-500'}`}>{s.label}</div>
                        {idx === 1 && <div className='text-xs text-gray-500'>Estimated delivery in 3–5 days</div>}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Items */}
              <section className='rounded-xl border p-4 sm:p-5'>
                <h2 className='font-medium mb-3'>Items ({items.length})</h2>
                <div className='divide-y'>
                  {items.map((it) => {
                    const pct = it.unitOriginal > 0 ? Math.max(0, Math.min(90, Math.round(100 - (it.unitDiscounted / it.unitOriginal) * 100))) : 0
                    return (
                      <div key={`${it._id}-${it.size}`} className='py-4 flex items-center gap-4'>
                        <div className='w-16 h-16 rounded-lg border overflow-hidden bg-white'>
                          {it.image ? (
                            <img src={it.image} alt={it.name} className='w-full h-full object-contain' />
                          ) : (
                            <div className='w-full h-full bg-gray-100' />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between gap-3'>
                            <div className='text-sm font-medium text-gray-900 line-clamp-1'>{it.name}</div>
                            {pct > 0 && (
                              <span className='shrink-0 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200'>{pct}% OFF</span>
                            )}
                          </div>
                          <div className='mt-1 flex items-center gap-2 text-xs text-gray-600'>
                            <span className='px-2 py-0.5 rounded-full bg-gray-100 border'>Size: {it.size}</span>
                            <span className='px-2 py-0.5 rounded-full bg-gray-100 border'>Qty: {it.quantity}</span>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-xs text-gray-500 line-through'>{totals.currency}{it.unitOriginal} ea</div>
                          <div className='text-sm font-semibold'>{totals.currency}{it.lineDiscounted}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className='space-y-6'>
              <section className='rounded-xl border p-4 sm:p-5'>
                <h2 className='font-medium mb-2'>Delivery to</h2>
                <div className='text-sm text-gray-700'>
                  <div className='font-medium'>{contact.fullName}</div>
                  <div>{shippingAddress.address}</div>
                  <div className='text-gray-600'>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</div>
                  <div className='text-gray-600 mt-1'>{contact.phone} • {contact.email}</div>
                </div>
              </section>

              <section className='rounded-xl border p-4 sm:p-5'>
                <h2 className='font-medium mb-2'>Payment</h2>
                <div className='text-sm text-gray-700'>
                  <div className='capitalize'>{payment.method === 'cod' ? 'Cash on Delivery' : payment.method}</div>
                  {payment.upiVpa ? <div className='text-gray-600'>UPI: {payment.upiVpa}</div> : null}
                </div>
              </section>

              <section className='rounded-xl border p-4 sm:p-5'>
                <h2 className='font-medium mb-3'>Summary</h2>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span>Subtotal</span>
                    <div className='text-right'>
                      <div className='line-through text-gray-400'>{totals.currency}{totals.originalSubtotal}</div>
                      <div className='font-medium'>{totals.currency}{totals.discountedSubtotal}</div>
                    </div>
                  </div>
                  <div className='flex justify-between text-green-700'>
                    <span>You save</span>
                    <span>-{totals.currency}{totals.savings}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping</span>
                    <span>{totals.shipping ? `${totals.currency}${totals.shipping}` : 'Free'}</span>
                  </div>
                  <div className='border-t pt-2 flex justify-between text-base font-semibold'>
                    <span>Total</span>
                    <span>{totals.currency}{totals.grandTotal}</span>
                  </div>
                </div>
                <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  <button onClick={printInvoice} className='px-4 py-2 rounded-full bg-black text-white hover:opacity-90'>Print invoice</button>
                  <Link to='/collection' className='px-4 py-2 rounded-full border border-gray-300 hover:border-black text-center'>Shop more</Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order