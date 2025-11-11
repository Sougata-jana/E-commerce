import React, { useContext } from 'react'
import { shopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

function ProductIteams({_id, image, name, price}) {

    const {currency} = useContext(shopContext)
  return (
    <Link className='text-gray-700 cursor-pointer block group' to={`/product/${_id}`}>
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
      <div className='pt-3 pb-2 h-[64px]'>
        <p className='text-sm font-medium line-clamp-2 leading-snug'>{name}</p>
      </div>
      <p className='text-sm font-semibold'>{currency}{price}</p>
    </Link>
  )
}

export default ProductIteams