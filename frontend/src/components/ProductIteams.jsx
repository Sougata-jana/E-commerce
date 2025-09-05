import React, { useContext } from 'react'
import { shopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

function ProductIteams({_id, image, name, price}) {

    const {currency} = useContext(shopContext)
  return (
    <Link className='text-gray-700 cursor-pointer block group' to={`/product/${_id}`}>
      <div className='overflow-hidden rounded'>
        <img className='hover:scale-110 transition-transform duration-300 ease-in-out w-full' src={image[0]} alt={name} />
      </div>
      <p className='pt-3 pb-1 text-sm font-medium line-clamp-1'>{name}</p>
      <p className='text-sm font-semibold'>{currency}{price}</p>
    </Link>
  )
}

export default ProductIteams