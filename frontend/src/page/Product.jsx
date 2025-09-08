import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { shopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

function Product() {
  const { productID } = useParams()
  const { products, currency } = useContext(shopContext)

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
    // Placeholder: hook up to cart context/integration if available
    // For now, simple visual feedback
    alert('Added to cart')
  }

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
          <div className='aspect-square bg-white rounded-lg border overflow-hidden flex items-center justify-center'>
            {activeImg ? (
              <img src={activeImg} alt={product.name} className='max-h-full max-w-full object-contain' />
            ) : (
              <div className='w-full h-full animate-pulse bg-gray-100' />
            )}
          </div>
          {product.image && product.image.length > 1 && (
            <div className='mt-3 grid grid-cols-5 gap-2'>
              {product.image.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`aspect-square rounded-md border overflow-hidden bg-white ${activeImg === img ? 'ring-2 ring-black' : ''}`}
                  aria-label={`Preview ${idx+1}`}
                >
                  <img src={img} alt={`${product.name} ${idx+1}`} className='w-full h-full object-contain' />
                </button>
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

          <div className='mt-4 text-2xl font-semibold text-gray-900'>
            {currency}{product.price}
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

          {/* Info bar */}
          <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
            <div className='flex items-center gap-3 p-3 rounded border bg-white'>
              <img src={assets.exchange_icon} alt='' className='w-8 h-8'/>
              <div>
                <p className='font-medium text-gray-800'>Easy Exchange</p>
                <p className='text-gray-500'>7-day return policy</p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-3 rounded border bg-white'>
              <img src={assets.guarantee_quality_icon} alt='' className='w-8 h-8'/>
              <div>
                <p className='font-medium text-gray-800'>Quality Guarantee</p>
                <p className='text-gray-500'>Curated products</p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-3 rounded border bg-white'>
              <img src={assets.support_icon} alt='' className='w-8 h-8'/>
              <div>
                <p className='font-medium text-gray-800'>Support</p>
                <p className='text-gray-500'>We’re here to help</p>
              </div>
            </div>
          </div>
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
            {related.map(item => (
              <Link key={item._id} to={`/product/${item._id}`} className='block group'>
                <div className='overflow-hidden rounded border bg-white'>
                  <img src={item.image?.[0]} alt={item.name} className='w-full h-48 object-contain bg-white group-hover:scale-105 transition-transform' />
                </div>
                <p className='mt-2 text-sm text-gray-800 line-clamp-1'>{item.name}</p>
                <p className='text-sm font-semibold'>{currency}{item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Product