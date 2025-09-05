import React from 'react'
import { assets } from '../assets/assets'

function OurPolicy() {
  return (
    <div className='flex flex-col sm:flex-row justify-between gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm lg:text-base text-gray-800'>
        <div>
        <img className='w-12 m-auto mb-5' src={assets.exchange_icon} alt="" />
        <p className='font-semibold '>Easy exchange policy</p>
        <p className='text-gray-500'>Our exchange policy is simple and stress-free</p>
        </div>
        <div>
        <img className='w-12 m-auto mb-5' src={assets.quality_icon} alt="" />
        <p className='font-semibold '>7 Days return Policy</p>
        <p className='text-gray-500'>Enjoy hassle-free returns within 7 days.</p>
        </div>
        <div>
        <img className='w-12 m-auto mb-5' src={assets.support_icon} alt="" />
        <p className='font-semibold '>Best customer support</p>
        <p className='text-gray-500'>Dedicated to providing top-notch customer servic</p>
        </div>
        
    </div>
  )
}

export default OurPolicy