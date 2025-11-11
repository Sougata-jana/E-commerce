import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { shopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import CartToatal from '../components/CartToatal'; // Assuming this component exists and will also be styled

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
    getOfferPercentForProduct,
    getDiscountedUnitPrice,
  } = useContext(shopContext);

  const cartData = useMemo(() => {
    const list = [];
    for (const id in cartItem) {
      const prod = (products || []).find(p => p._id === id);
      if (!prod) continue;
      for (const size in cartItem[id]) {
        const quantity = cartItem[id][size];
        if (quantity > 0) list.push({ product: prod, size, quantity });
      }
    }
    return list;
  }, [cartItem, products]);

  const subtotal = useMemo(() => getCartSubtotal(), [cartItem, getCartSubtotal]);
  const shipping = cartData.length > 0 ? delivery_fee : 0;
  const total = subtotal + shipping; // This 'total' is not explicitly used here but good to keep.

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
      <h1 className='text-5xl font-extrabold text-gray-900 mb-10 text-center sm:text-left'>Your Shopping Cart</h1>

      {cartData.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-xl border border-gray-100'>
          <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className='mt-6 text-2xl font-semibold text-gray-900'>Your cart is empty!</h3>
          <p className='mt-2 text-lg text-gray-600 max-w-md text-center'>
            Looks like you haven't added anything to your cart yet. Start exploring our collection!
          </p>
          <Link to='/collection' className='mt-8 inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200'>
            <svg className="h-6 w-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354v15.3l-4.354-4.354M12 4.354l4.354 4.354M12 4.354c0-1.782 1.05-3.472 2.766-4.086M12 4.354l.79-1.054M12 4.354h-1.646c-1.782 0-3.472-1.05-4.086-2.766L12 4.354" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items List */}
          <div className='lg:col-span-2 space-y-6'>
            {cartData.map(({ product, size, quantity }) => {
              const offerPercent = getOfferPercentForProduct(product);
              const discountedPrice = getDiscountedUnitPrice(product);
              const originalPrice = product.price; // Assuming product.price is the original price

              return (
                <div key={`${product._id}-${size}`} className='flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 transition-transform duration-200 hover:scale-[1.005]'>
                  <Link to={`/product/${product._id}`} className='flex-shrink-0 block w-28 h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-200'>
                    <img
                      src={product.image?.[0]}
                      alt={product.name}
                      className='w-full h-full object-cover p-2' // Added padding for object-contain
                    />
                  </Link>

                  <div className='flex-1 min-w-0 text-center sm:text-left'>
                    <Link to={`/product/${product._id}`} className='text-xl font-bold text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors'>
                      {product.name}
                    </Link>
                    <div className='text-sm text-gray-600 mt-1'>Size: <span className='font-medium text-gray-800'>{size}</span></div>

                    <div className='flex items-center justify-center sm:justify-start gap-3 mt-3'>
                      {offerPercent > 0 && (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200'>
                          {offerPercent}% OFF
                        </span>
                      )}
                      <span className='text-lg font-bold text-gray-900'>
                        {currency}{discountedPrice.toFixed(2)}
                      </span>
                      {offerPercent > 0 && (
                        <span className='text-sm text-gray-500 line-through'>
                          {currency}{originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className='flex items-center justify-center sm:justify-start gap-4 mt-4'>
                      <div className='inline-flex items-center rounded-full border border-gray-300 overflow-hidden shadow-sm'>
                        <button
                          onClick={() => decCart(product._id, size, 1)}
                          className={`px-4 py-2 text-xl font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className='px-5 py-2 select-none text-lg font-semibold text-gray-800 bg-white'>
                          {quantity}
                        </span>
                        <button
                          onClick={() => addCart(product._id, size, 1)}
                          className='px-4 py-2 text-xl font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors duration-200'
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          removeCart(product._id, size);
                          toast.info(`${product.name} (${size}) removed from cart.`);
                        }}
                        className='text-base font-medium text-red-600 hover:text-red-800 transition-colors flex items-center gap-1'
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className='flex flex-col items-center sm:items-end text-lg font-bold text-gray-900 mt-4 sm:mt-0'>
                    <span className='text-sm text-gray-500 font-normal'>Total:</span>
                    <span>{currency}{(discountedPrice * quantity).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary (assuming CartToatal is well-styled) */}
          <div>
            <CartToatal />
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;