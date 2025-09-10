import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

function Hero() {
  const slides = [
    {
      id: 0,
      badge: 'New arrivals',
      title: 'Find your style. Feel your best.',
      desc: 'Fresh drops across Men, Women, and Kids. Premium fits and comfortable fabrics.',
      image: assets.Hero_img,
      layout: 'normal',
    },
    {
      id: 1,
      badge: 'Bestsellers',
      title: 'Most-loved fits are back.',
      desc: 'Top-rated pieces, restocked. Get them before they’re gone.',
      image: assets.Hero,
      layout: 'reverse',
    },
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000) // 10s interval
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Track */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s) => (
          <div key={s.id} className="w-full flex-shrink-0">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center`}>
              {/* Copy */}
              <div className={`px-6 py-10 md:pl-10 lg:pl-14 ${s.layout === 'reverse' ? 'md:order-2' : ''}`}>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                  {s.badge}
                </span>
                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-gray-900">
                  {s.title}
                </h1>
                <p className="mt-3 text-gray-600 max-w-prose">
                  {s.desc}
                </p>
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
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                  <div className="flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-br from-white to-slate-50 shadow-sm">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#ffb4a2]/30" />
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-800">Easy exchange</div>
                      <div className="text-[11px] text-gray-500">7-day return policy</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-br from-white to-slate-50 shadow-sm">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#f2e8cf]" />
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-800">Quality assured</div>
                      <div className="text-[11px] text-gray-500">Premium fabrics & fit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-br from-white to-slate-50 shadow-sm">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100" />
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-800">24/7 support</div>
                      <div className="text-[11px] text-gray-500">We’re here to help</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className={`relative pr-6 md:pr-10 lg:pr-14 pb-8 ${s.layout === 'reverse' ? 'md:order-1' : ''}`}>
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ffb4a2]/30 blur-2xl" />
                <div className="pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-[#f2e8cf]/60 blur-2xl" />
                <div className="relative aspect-[4/3] w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm flex items-center justify-center overflow-hidden">
                  <img className="h-full w-full object-contain" src={s.image} alt={s.title} loading="eager" decoding="async" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i+1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-black' : 'w-2 bg-gray-300'}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero