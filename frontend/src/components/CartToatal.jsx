import React from 'react'
import { useContext } from 'react'
import { shopContext } from '../context/ShopContext'

function CartToatal() {
    const {
        currency,
        getCartSubtotal,
        cartItem,
    } = useContext(shopContext)

      const subtotal = useMemo(() => getCartSubtotal(), [cartItem, getCartSubtotal])
      const shipping = cartData.length > 0 ? delivery_fee : 0
      const total = subtotal + shipping
    
  return (
    <div>
                  <div>
            <div className='rounded-xl bg-white p-4 shadow-sm'>
              <h2 className='font-semibold mb-3'>Summary</h2>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>{currency}{subtotal}</span>
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
              <button onClick={() => { if (cartData.length) { if (confirm('Clear cart?')) { localStorage.removeItem('cart'); toast.info('Cart cleared') } } }} className='mt-2 w-full text-sm text-gray-600 hover:underline'>Clear cart</button>
            </div>
          </div>
    </div>
  )
}

export default CartToatal