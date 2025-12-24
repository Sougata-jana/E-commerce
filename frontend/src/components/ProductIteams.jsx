import React, { useContext } from 'react'
import { shopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

function ProductIteams({_id, image, name, price, originalPrice}) {

    const {currency} = useContext(shopContext)
  return (
    <Link className='text-gray-700 cursor-pointer block group overflow-hidden' to={`/product/${_id}`}>
      {/* Uniform card: fixed image area and consistent text area */}
      <div className='overflow-hidden rounded bg-white'>
        <div className='w-full aspect-[4/5] bg-white flex items-center justify-center'>
          <img
            className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-in-out'
            src={Array.isArray(image) ? image[0] : image}
            alt={name}
            loading='lazy'
          />
        </div>
      </div>
      <div className='pt-2 pb-2 w-full px-1'>
        <p className='text-sm font-medium line-clamp-2 leading-snug mb-2 w-full break-words'>{name}</p>
        <div className='w-full block'>
          <p className='text-sm font-bold text-blue-600 block mb-1'>{currency}{price}</p>
          {originalPrice && originalPrice > price && (
            <p className='text-xs text-gray-500 line-through block'>{currency}{originalPrice}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductIteams