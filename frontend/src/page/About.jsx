import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'; // Ensure assets.Hero_img is a compelling image

function About() {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20'>

      {/* Hero Section */}
      <section className='relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl mb-16 lg:mb-24'>
        <div className='absolute inset-0'>
          {/* Dynamic background image for hero */}
          <img 
            src={assets.Hero_img} // Use a high-quality, inspiring image here
            alt='About Us Hero' 
            className='w-full h-full object-cover opacity-40 md:opacity-50' 
          />
          <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent'></div>
        </div>

        <div className='relative z-10 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24 text-white text-center md:text-left'>
          <div className='max-w-3xl mx-auto md:mx-0'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight'>
              Crafting everyday style with comfort.
            </h1>
            <p className='mt-6 text-lg sm:text-xl text-gray-200 max-w-prose leading-relaxed'>
              We started with a simple belief: great style should feel as good as it looks. From premium fabrics to thoughtful fits, we design pieces that move with you — day in, day out.
            </p>
            <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start'>
              <Link to='/collection' className='px-7 py-3 rounded-full bg-white text-gray-900 text-lg font-semibold shadow-lg hover:bg-gray-100 transition duration-300'>Shop Our Collection</Link>
              <a href='#story' className='px-7 py-3 rounded-full border-2 border-white text-white text-lg font-semibold hover:bg-white/20 transition duration-300'>Discover Our Story</a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id='story' className='my-16 lg:my-24'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 items-start'>
          <div className='md:col-span-2'>
            <h2 className='text-4xl font-extrabold text-gray-900 mb-6'>Our Journey Unfolds</h2>
            <p className='mt-4 text-lg text-gray-700 leading-relaxed mb-6'>
              Founded in 2024, we set out to build a brand that pairs modern aesthetics with uncompromising comfort. What started as a small batch of essentials has grown into a loved collection across Men, Women, and Kids. Every piece is crafted with premium materials and a focus on fit, so you look great and feel your best.
            </p>
            <p className='text-lg text-gray-700 leading-relaxed'>
              We listen to our community and evolve quickly — bringing back bestsellers, refining fabrics, and designing with purpose. It’s style that works for real life.
            </p>
          </div>
          
          {/* Story Statistics */}
          <div className='flex flex-col gap-6 p-6 bg-gray-50 rounded-2xl shadow-inner'>
            <div className='p-5 bg-white rounded-xl shadow-md border border-gray-100'>
              <div className='text-5xl font-extrabold text-indigo-600 mb-1'>40+</div>
              <div className='text-base text-gray-700 font-medium'>Curated Products</div>
              <div className='text-sm text-gray-500'>Across diverse categories</div>
            </div>
            <div className='p-5 bg-white rounded-xl shadow-md border border-gray-100'>
              <div className='text-5xl font-extrabold text-rose-600 mb-1'>24/7</div>
              <div className='text-base text-gray-700 font-medium'>Dedicated Support</div>
              <div className='text-sm text-gray-500'>Always here to help you</div>
            </div>
            <div className='p-5 bg-white rounded-xl shadow-md border border-gray-100'>
              <div className='text-5xl font-extrabold text-amber-600 mb-1'>7-Day</div>
              <div className='text-base text-gray-700 font-medium'>Hassle-Free Returns</div>
              <div className='text-sm text-gray-500'>Shop with complete confidence</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Value Section */}
      <section className='my-16 lg:my-24'>
        <h2 className='text-4xl font-extrabold text-gray-900 text-center mb-12'>Our Core Values</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[{
              title: 'Comfort-First Design',
              text: 'Soft, breathable fabrics and thoughtful fits — so you wear them more, live more, and feel great.'
          }, {
              title: 'Timeless & Versatile Style',
              text: 'Clean lines, versatile colors, and adaptable pieces that effortlessly integrate into any wardrobe.'
          }, {
              title: 'Superior Materials',
              text: 'We meticulously select materials for exceptional durability, luxurious feel, and lasting quality, not fleeting trends.'
          }].map((v) => (
            <div key={v.title} className='p-8 rounded-2xl bg-white shadow-lg border border-gray-100 transform hover:scale-105 transition duration-300'>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>{v.title}</h3>
              <p className='text-base text-gray-600 leading-relaxed'>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className='my-16 lg:my-24'>
        <h2 className='text-4xl font-extrabold text-gray-900 text-center mb-12'>Our Growth Timeline</h2>
        <ol className='relative border-s-4 border-gray-200 ps-6 space-y-10'>
          {[{y:'2024',t:'Launched with a curated collection of everyday essentials, establishing our foundation in comfort and style.'},{y:'2025',t:'Expanded our offerings to include dedicated lines for Women and Kids, broadening our reach and impact.'},{y:'Today',t:'Continuously iterating and innovating, driven by invaluable community feedback and a commitment to excellence.'}].map((step, index)=> (
            <li key={step.y} className='relative group'>
              {/* Timeline dot */}
              <span className='absolute -left-8 top-1.5 h-6 w-6 rounded-full bg-black text-white text-xs font-semibold flex items-center justify-center ring-4 ring-gray-500/20'>
                {step.y.length === 4 ? step.y.slice(2,4) : 'Now'}
              </span>
              <div className='ms-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 transform group-hover:scale-[1.01] transition duration-300'>
                <h3 className='text-xl font-bold text-gray-900 mb-1'>{step.y}</h3>
                <p className='text-base text-gray-700 leading-relaxed'>{step.t}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Final Call to Action */}
      <section className='my-16 lg:my-24'>
        <div className='bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl p-10 sm:p-14 text-white text-center shadow-2xl'>
          <h2 className='text-4xl font-extrabold leading-tight mb-4'>Ready to Discover Your Style?</h2>
          <p className='text-xl text-gray-100 max-w-2xl mx-auto mb-8'>
            Explore our collections and find pieces designed to make you look and feel your absolute best, every day.
          </p>
          <Link to='/collection' className='inline-block px-10 py-4 rounded-full bg-white text-indigo-700 text-xl font-semibold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition duration-300'>
            Shop New Arrivals
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;