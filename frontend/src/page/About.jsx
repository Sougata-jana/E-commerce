import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

function About() {
  return (
    <div className='max-w-6xl mx-auto px-6 lg:px-10 my-10'>
      {/* Hero */}
      <section className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 via-rose-200 to-indigo-200 p-8 sm:p-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div className='max-w-3xl'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900'>Crafting everyday style with comfort</h1>
            <p className='mt-3 text-gray-700 max-w-prose'>We started with a simple belief: great style should feel as good as it looks. From premium fabrics to thoughtful fits, we design pieces that move with you — day in, day out.</p>
            <div className='mt-6 flex gap-3'>
              <Link to='/collection' className='px-5 py-2.5 rounded-full bg-black text-white hover:opacity-90'>Shop collection</Link>
              <a href='#story' className='px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'>Our story</a>
            </div>
          </div>
          <div className='hidden md:block'>
            <div className='relative ml-auto w-full max-w-xs lg:max-w-sm aspect-[4/5] rounded-xl overflow-hidden border border-white/40 bg-white/20'>
              <img src={assets.Hero_img} alt='About visual' className='absolute inset-0 w-full h-full object-cover' />
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section id='story' className='mt-10 grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          <h2 className='text-xl font-semibold text-gray-900'>Our story</h2>
          <p className='mt-3 text-gray-700 leading-relaxed'>Founded in 2024, we set out to build a brand that pairs modern aesthetics with uncompromising comfort. What started as a small batch of essentials has grown into a loved collection across Men, Women, and Kids. Every piece is crafted with premium materials and a focus on fit, so you look great and feel your best.</p>
          <p className='mt-3 text-gray-700 leading-relaxed'>We listen to our community and evolve quickly — bringing back bestsellers, refining fabrics, and designing with purpose. It’s style that works for real life.</p>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='p-4 rounded-xl bg-white shadow-sm'>
            <div className='text-3xl font-semibold'>40+</div>
            <div className='text-sm text-gray-600'>Products across categories</div>
          </div>
          <div className='p-4 rounded-xl bg-white shadow-sm'>
            <div className='text-3xl font-semibold'>24/7</div>
            <div className='text-sm text-gray-600'>Support when you need it</div>
          </div>
          <div className='p-4 rounded-xl bg-white shadow-sm'>
            <div className='text-3xl font-semibold'>7-day</div>
            <div className='text-sm text-gray-600'>Hassle-free exchange</div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className='mt-10'>
        <h2 className='text-xl font-semibold text-gray-900'>What we value</h2>
        <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[{
            title:'Comfort-first design',
            text:'Soft, breathable fabrics and thoughtful fits — so you wear them more.'
          },{
            title:'Timeless style',
            text:'Clean lines and versatile colors that pair with everything.'
          },{
            title:'Better materials',
            text:'We pick materials for durability and feel, not trends.'
          }].map((v)=> (
            <div key={v.title} className='p-5 rounded-xl bg-white shadow-sm border'>
              <div className='text-sm font-semibold text-gray-900'>{v.title}</div>
              <div className='mt-1 text-sm text-gray-600'>{v.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className='mt-10'>
        <h2 className='text-xl font-semibold text-gray-900'>Our journey</h2>
        <ol className='mt-4 relative border-s-2 border-dashed ps-4 space-y-4'>
          {[{y:'2024',t:'Launched with everyday essentials'},{y:'2025',t:'Expanded to Women and Kids'},{y:'Today',t:'Iterating fast with community feedback'}].map((step)=> (
            <li key={step.y} className='group'>
              <span className='absolute -start-[11px] top-0 h-5 w-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center'>{step.y.slice(0,2)}</span>
              <div className='ms-4'>
                <div className='text-sm text-gray-900'>{step.y}</div>
                <div className='text-xs text-gray-600'>{step.t}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className='mt-12'>
        <div className='rounded-2xl border p-6 sm:p-8 bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <div className='text-lg font-medium text-gray-900'>Join our community</div>
            <div className='text-sm text-gray-600'>Get early access to drops and exclusive member offers.</div>
          </div>
          <Link to='/collection' className='px-5 py-2.5 rounded-full bg-black text-white hover:opacity-90'>Shop now</Link>
        </div>
      </section>
    </div>
  )
}

export default About