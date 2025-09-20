import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { shopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import CartToatal from '../components/CartToatal'

function Cart() {
  const {
    products,
    currency,
    cartItem,
    addCart,
    decCart,
    removeCart,
    delivery_fee,
    getCartSubtotal,
  } = useContext(shopContext)

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

  const subtotal = useMemo(() => getCartSubtotal(), [cartItem, getCartSubtotal])
  const shipping = cartData.length > 0 ? delivery_fee : 0
  const total = subtotal + shipping

  return (
    <div className='max-w-7xl mx-auto px-6 lg:px-12 my-8'>
      <h1 className='text-2xl font-semibold mb-6'>Your Cart</h1>

      {cartData.length === 0 ? (
        <div className='text-center py-16 text-gray-600'>
          <p>Your cart is empty.</p>
          <Link to='/collection' className='inline-block mt-4 px-4 py-2 rounded-full bg-black text-white hover:opacity-90'>Continue shopping</Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Items */}
          <div className='lg:col-span-2'>
            <div className='divide-y rounded-xl bg-white shadow-sm'>
              {cartData.map(({ product, size, quantity }) => (
                <div key={`${product._id}-${size}`} className='p-4 flex items-center gap-4'>
                  <Link to={`/product/${product._id}`} className='block w-20 h-20 rounded overflow-hidden bg-white border'>
                    <img src={product.image?.[0]} alt={product.name} className='w-full h-full object-contain' />
                  </Link>
                  <div className='flex-1 min-w-0'>
                    <Link to={`/product/${product._id}`} className='font-medium text-gray-900 line-clamp-1'>{product.name}</Link>
                    <div className='text-xs text-gray-500 mt-0.5'>Size: {size}</div>
                    <div className='mt-2 flex items-center gap-3'>
                      <div className='inline-flex items-center rounded-full border border-gray-300 overflow-hidden'>
                        <button
                          onClick={() => {
                            if (quantity > 1) {
                              decCart(product._id, size, 1)
                            }
                          }}
                          className={`px-3 py-1.5 text-lg ${quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                          disabled={quantity <= 1}
                        >-</button>
                        <span className='px-3 select-none text-sm'>{quantity}</span>
                        <button onClick={() => addCart(product._id, size, 1)} className='px-3 py-1.5 text-lg'>+</button>
                      </div>
                      <button onClick={() => { removeCart(product._id, size); toast.info('Item removed') }} className='text-sm text-red-600 hover:underline'>Remove</button>
                    </div>
                  {/* Product description */}
                  {product.desc && (
                    <div className='mt-1 text-xs text-gray-500 line-clamp-2'>{product.desc}</div>
                  )}
                </div>
                  <div className='text-right'>
                    <div className='text-sm text-gray-500'>{currency}{product.price} each</div>
                    <div className='font-semibold'>{currency}{product.price * quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CartToatal/>
        </div>
      )}
    </div>
  )
}

export default Cart