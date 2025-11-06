import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

function Hero() {
  const slides = useMemo(() => ([
    {
      id: 1,
      title: "Find Your Style. Feel Your Best.",
      sub: "Premium fits for Men, Women & Kids",
      cta: { label: "Shop Collection", to: "/collection" },
      image: assets.Hero2,
      align: "items-center text-center"
    },
    {
      id: 2,
      title: "50% Off Summer Essentials",
      sub: null,
      cta: { label: "Shop The Sale", to: "/collection" },
      image: assets.Hero1,
      align: "items-start text-left"
    },
    {
      id: 3,
      title: "The Winter '25 Collection",
      sub: "New Arrivals Have Landed",
      cta: { label: "Explore Now", to: "/collection" },
      image: assets.Hero3,
      align: "items-end text-right"
    }
  ]), [])

  const [active, setActive] = useState(0)
  const timerRef = useRef(null)
  const AUTOPLAY_MS = 2000

  const start = () => {
    stop()
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length)
    }, AUTOPLAY_MS)
  }
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    start()
    return stop
  }, [slides.length])

  return (
    <section className="relative w-full overflow-hidden rounded-none sm:rounded-xl" onMouseEnter={stop} onMouseLeave={start}>
      {/* Track */}
      <div className="relative h-[70vh] sm:h-[75vh]">
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((s) => (
            <div key={s.id} className="relative h-full w-full flex-shrink-0">
              {/* Background image */}
              <img src={s.image} alt={s.title} className="h-full w-full object-cover object-top" />
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10" />
              {/* Text overlay */}
              <div className={`absolute inset-0 flex ${s.align} justify-center sm:justify-between p-6 sm:p-10 lg:p-16`}>
                <div className={`max-w-3xl mx-auto sm:mx-0 ${s.align.includes('text-right') ? 'ml-auto' : ''}`}>
                  <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    New Arrivals
                  </p>
                  <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                    {s.title}
                  </h2>
                  {s.sub && (
                    <p className="mt-3 text-base sm:text-lg text-white/90 max-w-xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                      {s.sub}
                    </p>
                  )}
                  <div className="mt-7">
                    <Link
                      to={s.cta.to}
                      className="inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow hover:bg-gray-200"
                    >
                      {s.cta.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        aria-label="Previous"
        onClick={() => setActive((i) => (i - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-gray-900 shadow hover:bg-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M15.78 5.22a.75.75 0 010 1.06L10.06 12l5.72 5.72a.75.75 0 11-1.06 1.06l-6.25-6.25a.75.75 0 010-1.06l6.25-6.25a.75.75 0 011.06 0z" clipRule="evenodd"/></svg>
      </button>
      <button
        aria-label="Next"
        onClick={() => setActive((i) => (i + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-gray-900 shadow hover:bg-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M8.22 18.78a.75.75 0 010-1.06L13.94 12 8.22 6.28a.75.75 0 111.06-1.06l6.25 6.25a.75.75 0 010 1.06l-6.25 6.25a.75.75 0 01-1.06 0z" clipRule="evenodd"/></svg>
      </button>

      {/* Dots */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActive(idx)}
            className={`pointer-events-auto h-2.5 w-2.5 rounded-full transition ${idx === active ? 'bg-white' : 'bg-white/50 hover:bg-white'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero