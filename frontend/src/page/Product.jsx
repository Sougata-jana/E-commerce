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
    setSelectedSize('')
    setQty(1)
  }, [productID, product])

  // Offer helpers and derived values MUST be declared unconditionally (before any early return)
  const deriveStablePercent = (id) => {
    const s = String(id || '')
    let sum = 0
    for (let i = 0; i < s.length; i++) sum = (sum + s.charCodeAt(i)) % 997
    // Map sum to 10..50%
    return 10 + (sum % 41)
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
    const newPrice = Math.round(price * (1 - offerPercent / 100))
    return newPrice
  }, [offerPercent, product?.price])

  if (!product) {
    return (
      <div className='max-w-7xl mx-auto px-6 lg:px-12 my-16 text-center text-gray-600'>
        <p>Product not found.</p>
        <Link to='/collection' className='inline-block mt-4 px-4 py-2 rounded border border-gray-300 hover:bg-gray-50'>Back to collection</Link>
      </div>
    )
  }

  const sizes = Array.isArray(product.sizes) ? product.sizes : []
  const related = (products || []).filter(p => p._id !== product._id && p.category === product.category).slice(0, 8)

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    addCart(product._id, selectedSize || 'default', qty)
    toast.success('Added to cart')
  }

  // Gallery helpers
  const images = Array.isArray(product.image) ? product.image : []
  const activeIndexRaw = images.indexOf(activeImg)
  const activeIndex = activeIndexRaw >= 0 ? activeIndexRaw : 0
  const customCaptions = Array.isArray(product.image_captions)
    ? product.image_captions
    : (Array.isArray(product.imageCaptions) ? product.imageCaptions : null)
  const getCaption = (idx) => {
    const total = images.length
    if (customCaptions && customCaptions[idx]) return customCaptions[idx]
    return `Image ${idx + 1} of ${total} — ${product.name}`
  }

  // offerPercent, offerText, discountedPrice already defined above (unconditional)

  return (
    <div className='max-w-7xl mx-auto px-6 lg:px-12 my-10'>
      {/* Breadcrumbs */}
      <div className='text-xs text-gray-500 mb-4'>
        <Link to='/' className='hover:underline'>Home</Link>
        <span className='mx-2'>/</span>
        <Link to='/collection' className='hover:underline'>Collection</Link>
        {product.category && (<>
          <span className='mx-2'>/</span>
          <span>{product.category}</span>
        </>)}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Gallery */}
        <div>
          <div className='aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center shadow-sm'>
            {activeImg ? (
              <img src={activeImg} alt={product.name} className='max-h-full max-w-full object-contain' />
            ) : (
              <div className='w-full h-full animate-pulse bg-gray-100' />
            )}
          </div>
          {/* Active image caption */}
          {images.length > 0 && (
            <p className='mt-2 text-xs text-gray-600'>
              {getCaption(activeIndex)}
            </p>
          )}
          {product.image && product.image.length > 1 && (
            <div className='mt-3 grid grid-cols-5 gap-2'>
              {product.image.map((img, idx) => (
                <div key={idx} className='flex flex-col items-center'>
                  <button
                    onClick={() => setActiveImg(img)}
                    className={`aspect-square w-full rounded-md overflow-hidden bg-white ${activeImg === img ? 'ring-2 ring-black' : ''}`}
                    aria-label={`Preview ${idx + 1}: ${getCaption(idx)}`}
                    title={getCaption(idx)}
                  >
                    <img src={img} alt={`${product.name} ${idx+1}`} className='w-full h-full object-contain' />
                  </button>
                  <p className='mt-1 text-[10px] leading-4 text-gray-600 text-center line-clamp-1 w-full' title={getCaption(idx)}>
                    {getCaption(idx)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className='flex items-start justify-between gap-4'>
            <h1 className='text-2xl sm:text-3xl font-semibold text-gray-900'>{product.name}</h1>
            {product.bestseller && (
              <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200'>
                <img src={assets.star_icon} alt='' className='w-3.5 h-3.5'/> Bestseller
              </span>
            )}
          </div>

          {/* Rating mock */}
          <div className='mt-2 flex items-center gap-1 text-sm text-gray-500'>
            {[0,1,2,3].map(i => (<img key={i} src={assets.star_icon} alt='' className='w-4 h-4'/>))}
            <img src={assets.star_dull_icon} alt='' className='w-4 h-4'/>
            <span className='ml-2'>(120 reviews)</span>
          </div>

          {/* Price + Offer */}
          <div className='mt-4 flex items-center gap-3'>
            <div className='text-2xl font-semibold text-gray-900'>{currency}{discountedPrice}</div>
            <div className='text-sm text-gray-500 line-through'>{currency}{product.price}</div>
            <span className='inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200'>{offerText}</span>
          </div>

          {product.description && (
            <p className='mt-4 text-sm leading-6 text-gray-700'>{product.description}</p>
          )}

          {sizes.length > 0 && (
            <div className='mt-6'>
              <div className='text-xs font-semibold text-gray-600 mb-2 tracking-wider uppercase'>Size</div>
              <div className='flex flex-wrap gap-2'>
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    type='button'
                    className={`px-3 py-1.5 rounded-full border text-sm ${selectedSize === s ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className='mt-6 flex items-center gap-4'>
            <div className='inline-flex items-center rounded-full border border-gray-300 overflow-hidden'>
              <button onClick={() => setQty(q => Math.max(1, q-1))} className='px-3 py-2 text-lg'>-</button>
              <span className='px-4 select-none'>{qty}</span>
              <button onClick={() => setQty(q => q+1)} className='px-3 py-2 text-lg'>+</button>
            </div>
            <button
              onClick={handleAddToCart}
              className='px-6 py-2.5 rounded-full bg-black text-white hover:opacity-90 shadow'
            >
              Add to cart
            </button>
          </div>

          {/* Trust banner image (optional). Add `trust_banner` to assets to display. */}
          {assets.trust_banner && (
            <div className='mt-8'>
              <img src={assets.trust_banner} alt='Trust badges' className='w-full rounded-xl shadow-sm' />
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className='mt-14'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>You may also like</h2>
            <Link to='/collection' className='text-sm text-gray-600 hover:underline'>View all</Link>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'>
            {related.map(item => {
              const p = extractPercent(item.offer)
              const percent = p == null || isNaN(p) ? deriveStablePercent(item._id) : p
              const label = `${Math.max(0, Math.min(90, percent))}% OFF`
              return (
                <Link key={item._id} to={`/product/${item._id}`} className='block group'>
                  <div className='relative overflow-hidden rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow'>
                    <span className='absolute left-2 top-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200'>
                      {label}
                    </span>
                    <img src={item.image?.[0]} alt={item.name} className='w-full h-48 object-contain bg-white group-hover:scale-105 transition-transform' />
                  </div>
                  <p className='mt-2 text-sm text-gray-800 line-clamp-1'>{item.name}</p>
                  <p className='text-sm font-semibold'>{currency}{item.price}</p>
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