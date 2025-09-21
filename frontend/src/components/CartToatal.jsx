import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { shopContext } from '../context/ShopContext'

function CartToatal() {
  const {
    currency,
    getCartSubtotal,
    getCartSubtotalDiscounted,
    getCartSavings,
    cartItem,
    delivery_fee,
    clearCart,
    navigate
  } = useContext(shopContext)

  const originalSubtotal = useMemo(() => getCartSubtotal(), [cartItem, getCartSubtotal])
  const discountedSubtotal = useMemo(() => getCartSubtotalDiscounted(), [cartItem, getCartSubtotalDiscounted])
  const savings = useMemo(() => getCartSavings(), [cartItem, getCartSavings])
      const itemCount = useMemo(() => {
        let count = 0
        for (const id in cartItem) {
          for (const size in cartItem[id]) {
            count += cartItem[id][size]
          }
        }
        return count
      }, [cartItem])
  const shipping = itemCount > 0 ? delivery_fee : 0
  const total = discountedSubtotal + shipping
    
  return (
    <div>
          <div>
            <div className='rounded-xl bg-white p-4 shadow-sm'>
              <h2 className='font-semibold mb-3'>Summary</h2>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span className='line-through text-gray-500'>{currency}{originalSubtotal}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Discounted subtotal</span>
                  <span>{currency}{discountedSubtotal}</span>
                </div>
                <div className='flex justify-between text-green-700'>
                  <span>You save</span>
                  <span>-{currency}{savings}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>{shipping ? `${currency}${shipping}` : 'Free'}</span>
                </div>
                <div className='border-t pt-2 flex justify-between font-semibold'>
                  <span>Total</span>
                  <span>{currency}{total}</span>
                </div>
              </div>
              <Link to='/placeorder' className='mt-4 block w-full text-center px-4 py-2.5 rounded-full bg-black text-white hover:opacity-90'>Checkout</Link>
              <button
                onClick={() => {
                  if (itemCount === 0) return
                  // eslint-disable-next-line no-alert
                  if (confirm('Clear cart?')) { clearCart(); toast.info('Cart cleared') }
                }}
                className='mt-2 w-full text-sm text-gray-600 hover:underline'
              >
                Clear cart
              </button>
            </div>
          </div>
    </div>
  )
}

export default CartToatal