import React, { useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router-dom'
import { shopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

function Product() {
  const { productID } = useParams()
  const { products, currency, addCart } = useContext(shopContext)

  const product = useMemo(() => {
    return (products || []).find(p => p._id === productID) || null
  }, [products, productID])

  const [activeImg, setActiveImg] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (product?.image?.[0]) setActiveImg(product.image[0])
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSelectedSize('') // Reset selected size on product change
    setQty(1) // Reset quantity on product change
  }, [productID, product])

  // --- Offer and Price Calculations (kept as is, but moved for clarity) ---
  const deriveStablePercent = (id) => {
    const s = String(id || '')
    let sum = 0
    for (let i = 0; i < s.length; i++) sum = (sum + s.charCodeAt(i)) % 997
    return 10 + (sum % 41) // Map sum to 10..50%
  }

  const extractPercent = (raw) => {
    if (typeof raw === 'number') return raw
    if (raw == null) return null
    const m = String(raw).match(/(\d+(?:\.\d+)?)/)
    return m ? parseFloat(m[1]) : null
  }

  const offerPercent = useMemo(() => {
    if (!product) return 0
    const p = extractPercent(product.offer)
    const percent = p == null || isNaN(p) ? deriveStablePercent(product._id) : p
    return Math.max(0, Math.min(90, percent))
  }, [product])

  const offerText = useMemo(() => `${offerPercent}% OFF`, [offerPercent])

  const discountedPrice = useMemo(() => {
    const price = Number(product?.price) || 0
    const newPrice = price * (1 - offerPercent / 100)
    return Math.round(newPrice * 100) / 100 // Round to 2 decimal places
  }, [offerPercent, product?.price])

  // --- Error/Not Found State ---
  if (!product) {
    return (
      <div className='max-w-7xl mx-auto px-6 lg:px-12 py-20 text-center flex flex-col items-center justify-center min-h-[50vh]'>
        <h2 className='text-4xl font-extrabold text-gray-900 mb-4'>Product Not Found</h2>
        <p className='text-lg text-gray-600 mb-8'>
          The product you are looking for might have been removed or does not exist.
        </p>
        <Link
          to='/collection'
          className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
        >
          <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Collection
        </Link>
      </div>
    )
  }

  // --- Derived Product Data ---
  const sizes = Array.isArray(product.size) ? product.size : [] // Corrected to product.size based on AddProduct
  const related = (products || [])
    .filter(p => p._id !== product._id && p.category === product.category)
    .slice(0, 5) // Display 5 related products

  // --- Add to Cart Logic ---
  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size before adding to cart.')
      return
    }
    addCart(product._id, selectedSize || 'default', qty)
    toast.success(`${qty}x ${product.name} ${selectedSize ? `(${selectedSize})` : ''} added to cart!`)
  }

  // --- Gallery Helpers ---
  const images = Array.isArray(product.image) ? product.image : []
  const activeIndexRaw = images.indexOf(activeImg)
  const activeIndex = activeIndexRaw >= 0 ? activeIndexRaw : 0
  const customCaptions = Array.isArray(product.image_captions)
    ? product.image_captions
    : (Array.isArray(product.imageCaptions) ? product.imageCaptions : null)
  const getCaption = (idx) => {
    const total = images.length
    if (customCaptions && customCaptions[idx]) return customCaptions[idx]
    return `Image ${idx + 1} of ${total}`
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to='/' className='hover:text-gray-700 transition-colors'>Home</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
            <Link to='/collection' className='hover:text-gray-700 transition-colors'>Collection</Link>
          </li>
          {product.category && (
            <li>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-700">{product.category}</span>
            </li>
          )}
        </ol>
      </nav>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10'>
        {/* Product Image Gallery */}
        <div>
          <div className='relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-[1.01]'>
            {activeImg ? (
              <img
                src={activeImg}
                alt={product.name}
                className='w-full h-full object-contain'
              />
            ) : (
              <div className='w-full h-full animate-pulse bg-gray-200 flex items-center justify-center text-gray-400'>
                <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {/* Offer badge on main image */}
            {offerPercent > 0 && (
              <span className='absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-red-600 text-white shadow-md'>
                {offerText}
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className='mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3'>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`aspect-square w-full rounded-lg overflow-hidden bg-white border-2 transition-all duration-200
                    ${activeImg === img ? 'border-indigo-500 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                  aria-label={`View image ${idx + 1}`}
                  title={getCaption(idx)}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className='w-full h-full object-contain'
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className='flex flex-col justify-between'>
          <div>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2'>
              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight'>
                {product.name}
              </h1>
              {product.bestSeller && ( // Corrected from product.bestseller
                <span className='inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 self-start'>
                  <img src={assets.star_icon} alt='Star' className='w-3 h-3 sm:w-4 sm:h-4' /> Bestseller
                </span>
              )}
            </div>

            {/* Rating mock */}
            <div className='flex items-center gap-1 text-sm sm:text-base text-gray-500 mb-3 sm:mb-4'>
              {[...Array(4)].map((_, i) => (<img key={i} src={assets.star_icon} alt='Star' className='w-4 h-4' />))}
              <img src={assets.star_dull_icon} alt='Dull Star' className='w-4 h-4' />
              <span className='ml-2 text-gray-600 font-medium'>(120 reviews)</span>
            </div>

            {/* Price Information */}
            <div className='flex items-center gap-3 mb-6'>
              {offerPercent > 0 && (
                <span className='text-xl sm:text-2xl font-bold text-gray-500 line-through'>
                  {currency}{Number(product.price).toFixed(2)}
                </span>
              )}
              <span className='text-3xl sm:text-4xl font-extrabold text-indigo-600'>
                {currency}{discountedPrice.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className='text-base leading-relaxed text-gray-700 mb-6'>
                {product.description}
              </p>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className='mb-6'>
                <div className='text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase'>
                  Select Size <span className="text-red-500">*</span>
                </div>
                <div className='flex flex-wrap gap-3'>
                  {sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      type='button'
                      className={`px-4 py-2 rounded-full border-2 text-base font-medium transition-all duration-200
                        ${selectedSize === s
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white text-gray-800 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8 pt-6 border-t border-gray-100'>
            <div className='inline-flex items-center rounded-full border border-gray-300 overflow-hidden bg-white text-gray-800 shadow-sm'>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className='px-4 py-2 text-xl font-medium hover:bg-gray-100 transition-colors'
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className='px-5 text-lg select-none font-semibold'>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className='px-4 py-2 text-xl font-medium hover:bg-gray-100 transition-colors'
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className='flex-1 px-8 py-3 rounded-full bg-indigo-600 text-white text-lg font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors w-full sm:w-auto'
            >
              <svg className="h-6 w-6 inline-block mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
          </div>

          {/* Trust banner image (optional). Add `trust_banner` to assets to display. */}
          {assets.trust_banner && (
            <div className='mt-8 pt-6 border-t border-gray-100'>
              <img src={assets.trust_banner} alt='Trust badges' className='w-full rounded-xl shadow-sm' />
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className='mt-16 bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-3xl font-extrabold text-gray-900'>You Might Also Like</h2>
            <Link
              to='/collection'
              className='text-lg font-medium text-indigo-600 hover:text-indigo-800 transition-colors'
            >
              View All <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {related.map(item => {
              const p = extractPercent(item.offer)
              const percent = p == null || isNaN(p) ? deriveStablePercent(item._id) : p
              const label = `${Math.max(0, Math.min(90, percent))}% OFF`
              const relatedDiscountedPrice = (Number(item.price) * (1 - percent / 100)).toFixed(2)
              return (
                <Link key={item._id} to={`/product/${item._id}`} className='block group transition-transform duration-200 hover:-translate-y-1'>
                  <div className='relative overflow-hidden rounded-xl bg-gray-50 border border-gray-200 group-hover:shadow-lg transition-shadow duration-200'>
                    <span className='absolute left-3 top-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm'>
                      {label}
                    </span>
                    <img
                      src={item.image?.[0]}
                      alt={item.name}
                      className='w-full h-48 object-contain transition-transform duration-300 group-hover:scale-105'
                    />
                  </div>
                  <div className='mt-3 px-1 overflow-hidden'>
                    <p className='text-base font-semibold text-gray-800 line-clamp-1'>{item.name}</p>
                    <div className='flex flex-col gap-0.5 mt-1'>
                      <span className='text-sm font-bold text-indigo-600 truncate'>{currency}{relatedDiscountedPrice}</span>
                      <span className='text-[10px] text-gray-500 line-through truncate'>{currency}{Number(item.price).toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Product