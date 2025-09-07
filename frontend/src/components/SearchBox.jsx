import React, { useContext, useEffect, useState } from 'react'
import { shopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

function SearchBox() {
  const { search, setSearch, showsearch, setShowSearch } = useContext(shopContext)



  const handleClear = () => setSearch('')
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setShowSearch(false)
  }

  if (!showsearch ) return null

  return   (
    <div className=" top-0 z-30 ">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="relative" role="search">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <img src={assets.search_icon} alt="Search" className="w-5 h-5" />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Search products, categories…"
            className="w-full h-12 pl-11 pr-24 rounded-full border border-gray-300 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
            aria-label="Search"
          />
          <div className="absolute right-2 inset-y-0 flex items-center gap-1">
            {search && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 text-xs rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close search bar"
            >
              <img className="w-4 h-4" src={assets.cancel_icon} alt="Close" />
            </button>
          </div>
        </div>

        {/* Quick suggestions (visual only) */}
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {['Men', 'Women', 'Kids', 'Topwear', 'Bottomwear'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearch(tag)}
              className="px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) 
}

export default SearchBox