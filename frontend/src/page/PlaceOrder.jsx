import React, { useContext, useMemo, useState } from 'react'
import { shopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

function PlaceOrder() {
  const {
    products,
    currency,
    cartItem,
    delivery_fee,
    getCartSubtotal,
    getCartSubtotalDiscounted,
    getCartSavings,
    getDiscountedUnitPrice,
    clearCart,
    navigate
  } = useContext(shopContext)

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment: 'cod',
    upiVpa: '',
  })

  const cartData = useMemo(() => {
    const list = []
    for (const id in cartItem) {
      const prod = (products || []).find(p => p._id === id)
      if (!prod) continue
      for (const size in cartItem[id]) {
        const quantity = cartItem[id][size]
        if (quantity > 0) list.push({ product: prod, size, quantity })
      }
    }
    return list
  }, [cartItem, products])

  const originalSubtotal = useMemo(() => getCartSubtotal(), [cartItem, getCartSubtotal])
  const discountedSubtotal = useMemo(() => getCartSubtotalDiscounted(), [cartItem, getCartSubtotalDiscounted])
  const savings = useMemo(() => getCartSavings(), [cartItem, getCartSavings])
  const shipping = cartData.length > 0 ? delivery_fee : 0
  const grandTotal = discountedSubtotal + shipping

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (cartData.length === 0) {
      toast.error('Your cart is empty')
      return false
    }
    const required = ['fullName','phone','email','address','city','state','pincode']
    for (const key of required) {
      if (!String(form[key]).trim()) {
        toast.error('Please fill all required fields')
        return false
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Enter a valid email')
      return false
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      toast.error('Enter a valid 10-digit phone number')
      return false
    }
    if (!/^\d{6}$/.test(form.pincode.replace(/\D/g, ''))) {
      toast.error('Enter a valid 6-digit pincode')
      return false
    }
    // Conditional payment validations
    if (['phonepe','navi','upi'].includes(form.payment)) {
      const vpa = String(form.upiVpa || '').trim()
      if (!/^[\w.\-]{2,}@[\w]{2,}$/i.test(vpa)) {
        toast.error('Enter a valid UPI ID (e.g., name@bank)')
        return false
      }
    }
    return true
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (!validate()) {
      if (cartData.length === 0) navigate('/collection')
      return
    }
    const order = {
      id: 'ORD-' + Date.now(),
      createdAt: new Date().toISOString(),
      payment: { method: form.payment, upiVpa: form.upiVpa || null },
      contact: { fullName: form.fullName, phone: form.phone, email: form.email },
      shippingAddress: { address: form.address, city: form.city, state: form.state, pincode: form.pincode },
      items: cartData.map(({ product, size, quantity }) => ({
        _id: product._id,
        name: product.name,
        image: product.image?.[0] || '',
        size,
        quantity,
        unitOriginal: Number(product.price) || 0,
        unitDiscounted: getDiscountedUnitPrice(product),
        lineOriginal: (Number(product.price) || 0) * quantity,
        lineDiscounted: getDiscountedUnitPrice(product) * quantity,
      })),
      totals: {
        originalSubtotal,
        discountedSubtotal,
        savings,
        shipping,
        grandTotal,
        currency,
      },
    }
    try {
      // Keep last placed order for quick detail
      localStorage.setItem('lastOrder', JSON.stringify(order))
      // Append to orders history array
      const prev = JSON.parse(localStorage.getItem('orders') || '[]')
      const updated = [order, ...prev.filter(o => o.id !== order.id)]
      localStorage.setItem('orders', JSON.stringify(updated))
    } catch {}
    toast.success('Order placed successfully!')
    clearCart()
    // Go to orders list so user can track/view
    navigate('/orders')
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-black/10 focus:border-black/40 outline-none bg-white'

  return (
    <div className='max-w-7xl mx-auto px-6 lg:px-12 my-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold'>Place Order</h1>
        <Link to='/cart' className='text-sm text-gray-700 underline hover:text-black'>Edit cart</Link>
      </div>

      {cartData.length === 0 ? (
        <div className='text-center py-16 text-gray-600'>
          <p>Your cart is empty.</p>
          <Link to='/collection' className='inline-block mt-4 px-4 py-2 rounded-full bg-black text-white hover:opacity-90'>Shop now</Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <form onSubmit={handlePlaceOrder} className='lg:col-span-2 space-y-6'>
            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h2 className='text-lg font-medium mb-4'>Contact</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-gray-600'>Full name</label>
                  <input name='fullName' value={form.fullName} onChange={onChange} className={inputClass} placeholder='John Doe' />
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Phone</label>
                  <input name='phone' value={form.phone} onChange={onChange} className={inputClass} placeholder='9876543210' inputMode='tel' />
                </div>
                <div className='sm:col-span-2'>
                  <label className='text-sm text-gray-600'>Email</label>
                  <input name='email' value={form.email} onChange={onChange} className={inputClass} placeholder='you@example.com' inputMode='email' />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h2 className='text-lg font-medium mb-4'>Shipping address</h2>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm text-gray-600'>Street address</label>
                  <input name='address' value={form.address} onChange={onChange} className={inputClass} placeholder='123 Main St, Apartment 4B' />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600'>City</label>
                    <input name='city' value={form.city} onChange={onChange} className={inputClass} placeholder='Kolkata' />
                  </div>
                  <div>
                    <label className='text-sm text-gray-600'>State</label>
                    <input name='state' value={form.state} onChange={onChange} className={inputClass} placeholder='West Bengal' />
                  </div>
                  <div>
                    <label className='text-sm text-gray-600'>Pincode</label>
                    <input name='pincode' value={form.pincode} onChange={onChange} className={inputClass} placeholder='700001' inputMode='numeric' />
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h2 className='text-lg font-medium mb-4'>Payment method</h2>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                {[
                  { key: 'cod', label: 'Cash on Delivery' },
                  { key: 'phonepe', label: 'PhonePe', logo: assets.PhonePe_logo_icon },
                  { key: 'navi', label: 'Navi UPI', logo: assets.Navi_New_Logo },
                  { key: 'upi', label: 'UPI (Other)' },
                  { key: 'card', label: 'Card' },
                ].map(opt => (
                  <label key={opt.key} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer bg-white ${form.payment === opt.key ? 'border-black' : 'border-gray-300 hover:border-black/50'}`}>
                    <input type='radio' name='payment' value={opt.key} checked={form.payment === opt.key} onChange={onChange} />
                    {opt.logo && (
                      <img src={opt.logo} alt={`${opt.label} logo`} className='h-5 w-auto' />
                    )}
                    <span className='text-sm'>{opt.label}</span>
                  </label>
                ))}
              </div>

              {['phonepe','navi','upi'].includes(form.payment) && (
                <div className='mt-4'>
                  <label className='text-sm text-gray-600'>UPI ID (VPA)</label>
                  <input name='upiVpa' value={form.upiVpa} onChange={onChange} className={inputClass} placeholder='yourname@bank' />
                  <p className='mt-1 text-xs text-gray-500'>Example: username@okhdfcbank</p>
                </div>
              )}
            </div>

            <div className='flex justify-end'>
              <button type='submit' className='px-6 py-3 rounded-full bg-black text-white hover:opacity-90'>Place order</button>
            </div>
          </form>

          {/* Order Summary */}
          <div className='space-y-4'>
            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h2 className='text-lg font-medium mb-4'>Order summary</h2>
              <div className='divide-y'>
                {cartData.map(({ product, size, quantity }) => (
                  <div key={`${product._id}-${size}`} className='py-3 flex items-center gap-3'>
                    <div className='w-14 h-14 rounded border overflow-hidden bg-white'>
                      <img src={product.image?.[0]} alt={product.name} className='w-full h-full object-contain' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-gray-900 line-clamp-1'>{product.name}</div>
                      <div className='text-xs text-gray-500'>Size: {size} • Qty: {quantity}</div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xs text-gray-500 line-through'>{currency}{product.price}</div>
                      <div className='text-sm font-semibold'>{currency}{getDiscountedUnitPrice(product) * quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-4 space-y-2 text-sm'>
                <div className='flex justify-between text-gray-700'>
                  <span>Subtotal</span>
                  <div className='text-right'>
                    <div className='line-through text-gray-400'>{currency}{originalSubtotal}</div>
                    <div className='font-medium'>{currency}{discountedSubtotal}</div>
                  </div>
                </div>
                <div className='flex justify-between text-green-700'>
                  <span>You save</span>
                  <span>-{currency}{savings}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>{shipping > 0 ? `${currency}${shipping}` : 'Free'}</span>
                </div>
                <div className='pt-2 border-t flex justify-between text-base font-semibold'>
                  <span>Total</span>
                  <span>{currency}{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlaceOrder