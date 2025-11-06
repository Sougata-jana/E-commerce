import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { shopContext } from '../context/ShopContext'

function Order() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const { currency: appCurrency, backendUrl, token } = useContext(shopContext)
  const initialOrder = useMemo(() => {
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

  const [order, setOrder] = useState(initialOrder)

  // Poll backend for this order to auto-refresh status when admin updates it
  useEffect(() => {
    const orderId = order?._id || order?.id || params.orderId
    if (!token || !backendUrl || !orderId) return

    let cancelled = false
    const fetchLatest = async () => {
      try {
        const res = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
        const list = res?.data?.orders || []
        const found = list.find(o => (o._id || o.id) === orderId)
        if (found && !cancelled) {
          // Merge to preserve any local-only fields if present
          setOrder(prev => ({ ...(prev || {}), ...found }))
        }
      } catch (_) {}
    }

    // Initial fetch and interval polling
    fetchLatest()
    const t = setInterval(fetchLatest, 10000) // 10s
    return () => { cancelled = true; clearInterval(t) }
  }, [backendUrl, token, order?._id, order?.id, params.orderId])

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

  // Normalize order fields to support both local (with totals/contact) and backend (amount/address/paymentMethod) shapes
  const id = order.id || order._id
  const createdAt = order.createdAt || (order.date ? new Date(order.date).toISOString() : new Date().toISOString())
  const shippingAddress = order.shippingAddress || order.address || {}
  const contact = order.contact || {
    fullName: shippingAddress.fullName || 'Customer',
    phone: shippingAddress.phone || '',
    email: shippingAddress.email || '',
  }
  const payment = order.payment || {
    method: (order.paymentMethod || 'cod').toLowerCase(),
    upiVpa: null,
  }
  const currency = (order.totals && order.totals.currency) || appCurrency || '₹'
  const totals = order.totals || {
    currency,
    originalSubtotal: order.amount ?? 0,
    discountedSubtotal: order.amount ?? 0,
    savings: 0,
    shipping: 0,
    grandTotal: order.amount ?? 0,
  }
  const items = order.items || []
  const selectedItemIndex = location.state?.selectedItemIndex
  const displayItems = (Number.isInteger(selectedItemIndex) && items[selectedItemIndex]) ? [items[selectedItemIndex]] : items

  // Build dynamic status steps based on current order.status
  // Normalize and map status into our step keys
  const rawStatus = String(order.status || 'placed').toLowerCase().trim()
  const statusKey = rawStatus
    .replace(/\s+/g, '-') // replace spaces with hyphen
    .replace(/^processing|^packed$/, 'packing') // common synonyms
    .replace(/^out-for-delivery|^outfor-delivery|^out-for-deliver$/, 'out-for-delivery')

  // Five-step tracker
  const stepKeys = ['placed', 'packing', 'shipped', 'out-for-delivery', 'delivered']
  const stepLabels = {
    placed: 'Order placed',
    packing: 'Packing',
    shipped: 'Shipped',
    'out-for-delivery': 'Out for delivery',
    delivered: 'Delivered',
  }
  const baseIndex = Math.max(0, stepKeys.indexOf(statusKey))
  const [stepIndex, setStepIndex] = useState(baseIndex)
  useEffect(() => { setStepIndex(baseIndex) }, [baseIndex])
  const steps = stepKeys.map((k, i) => ({ key: k, label: stepLabels[k] || k, done: i <= stepIndex }))

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
              {/* Status stepper */}
              <section className='rounded-xl border p-4 sm:p-5'>
                <div className='flex items-center justify-between gap-2'>
                  <h2 className='font-medium'>Status</h2>
                  {/* Arrow controls removed as requested */}
                </div>

                {/* Horizontal stepper */}
                <div className='mt-4'>
                  <div className='relative h-1 bg-gray-200 rounded-full'>
                    <div
                      className='absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-500'
                      style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  <div className='mt-5 grid grid-cols-5'>
                    {steps.map((s, i) => (
                      <div key={s.key} className={`flex flex-col items-center ${i === 0 ? 'justify-start' : i === steps.length - 1 ? 'justify-end' : 'justify-center'}`}>
                        <button
                          type='button'
                          onClick={() => setStepIndex(i)}
                          className={`h-6 w-6 rounded-full border flex items-center justify-center transition ${s.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-gray-500'}`}
                          aria-label={`Set to ${s.label}`}
                        >
                          {s.done ? (
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-3.5 w-3.5'>
                              <path fillRule='evenodd' d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.29a.75.75 0 1 0-1.22-.92l-3.443 4.57-1.86-1.86a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.143-.094l4-5.25Z' clipRule='evenodd' />
                            </svg>
                          ) : (
                            <span className='block h-2 w-2 rounded-full bg-gray-400' />
                          )}
                        </button>
                        <div className={`mt-2 text-xs ${s.done ? 'text-gray-900' : 'text-gray-500'}`}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <p className='mt-2 text-[11px] text-gray-500'>This indicator is visual. Actual delivery status updates from the seller will reflect here automatically.</p>
                </div>
              </section>

              {/* Items */}
              <section className='rounded-xl border p-4 sm:p-5'>
                <h2 className='font-medium mb-3'>Items ({displayItems?.length || 0})</h2>
                <div className='divide-y'>
                  {displayItems.map((it) => {
                    const unitOriginal = (typeof it.unitOriginal === 'number' ? it.unitOriginal : (typeof it.price === 'number' ? it.price : 0))
                    const unitDiscounted = (typeof it.unitDiscounted === 'number' ? it.unitDiscounted : (typeof it.price === 'number' ? it.price : unitOriginal))
                    const pct = unitOriginal > 0 ? Math.max(0, Math.min(90, Math.round(100 - (unitDiscounted / unitOriginal) * 100))) : 0
                    const img = Array.isArray(it.image) ? it.image[0] : it.image
                    return (
                      <div key={`${it._id}-${it.size}`} className='py-4 flex items-center gap-4'>
                        <div className='w-16 h-16 rounded-lg border overflow-hidden bg-white'>
                          {img ? (
                            <img src={img} alt={it.name} className='w-full h-full object-contain' />
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
                          <div className='text-xs text-gray-500 line-through'>{currency}{unitOriginal}</div>
                          <div className='text-sm font-semibold'>{currency}{unitDiscounted * (it.quantity || 1)}</div>
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