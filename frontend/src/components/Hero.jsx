import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
        {/* Copy */}
        <div className="px-6 py-10 md:pl-10 lg:pl-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
            New arrivals
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-gray-900">
            Find your style. Feel your best.
          </h1>
          <p className="mt-3 text-gray-600 max-w-prose">
            Fresh drops across Men, Women, and Kids. Premium fits, comfortable fabrics, and designs that last.
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/collection"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 shadow"
            >
              Shop collection
            </Link>
            <Link
              to="/collection"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              View bestsellers
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <img src={assets.exchange_icon} alt="Easy exchange" className="w-5 h-5" />
              <span>Easy exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={assets.quality_icon} alt="Quality assured" className="w-5 h-5" />
              <span>Quality assured</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={assets.support_icon} alt="24/7 support" className="w-5 h-5" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative pr-6 md:pr-10 lg:pr-14 pb-8">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ffb4a2]/30 blur-2xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-[#f2e8cf]/60 blur-2xl" />

          <div className="relative aspect-[4/3] w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm flex items-center justify-center overflow-hidden">
            <img
              className="h-full w-full object-contain"
              src={assets.Hero_img}
              alt="Latest fashion arrivals"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero