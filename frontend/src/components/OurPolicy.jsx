import React from 'react';
import { assets } from '../assets/assets';
// Assuming assets contains: exchange_icon, quality_icon, support_icon

function PolicyCard({ icon, title, description }) {
    return (
        <div className='p-6 flex flex-col items-center justify-center text-center transition duration-300'>
            {/* Icon */}
            <img className='w-16 h-16 object-contain mb-4 text-black' src={icon} alt={title} />
            
            {/* Title */}
            <p className='font-extrabold text-lg text-gray-900 uppercase tracking-wide mb-1'>{title}</p>
            
            {/* Description */}
            <p className='text-sm text-gray-500 max-w-xs'>{description}</p>
        </div>
    );
}

function OurPolicy() {
    return (
      // Added light background for visual separation and padding
      <div className='bg-gray-50 py-16 mt-16'> 
        <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                <PolicyCard
                    icon={assets.exchange_icon}
                    title="Easy Exchange"
                    description="Our exchange policy is simple and stress-free."
                />
                <PolicyCard
                    icon={assets.quality_icon}
                    title="7-Day Returns"
                    description="Enjoy hassle-free returns within 7 days of delivery."
                />
                <PolicyCard
                    icon={assets.support_icon}
                    title="24/7 Support"
                    description="Dedicated to providing top-notch customer service."
                />
            </div>
        </div>
      </div>
    );
}

export default OurPolicy;