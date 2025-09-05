import React, { useContext, useMemo, useState } from 'react';
import Title from '../components/Title';
import ProductIteams from '../components/ProductIteams';
import { shopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const CATEGORIES = ['Men', 'Women', 'Kids'];
const SUBCATEGORIES = ['Topwear', 'Bottomwear', 'Footwear', 'Accessories'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

function Collection() {
  const { products } = useContext(shopContext);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [subCategory, setSubCategory] = useState('All');
  const [size, setSize] = useState('All');
  const [sort, setSort] = useState('latest'); // latest | priceLow | priceHigh | name

  const filtered = useMemo(() => {
    let list = products || [];
    // Search by name
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(q));
    }
    // Category
    if (category !== 'All') {
      list = list.filter(p => p.category === category);
    }
    // SubCategory
    if (subCategory !== 'All') {
      list = list.filter(p => p.subCategory === subCategory);
    }
    // Size presence
    if (size !== 'All') {
      list = list.filter(p => Array.isArray(p.sizes) && p.sizes.includes(size));
    }
    // Sorting
    switch (sort) {
      case 'priceLow':
        list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'priceHigh':
        list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name':
        list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'latest':
      default:
        list = [...list].sort((a, b) => (b.date ?? 0) - (a.date ?? 0));
        break;
    }
    return list;
  }, [products, query, category, subCategory, size, sort]);

  // UI helpers
  const chipBase =
    'px-3 py-1.5 rounded-full border transition text-sm whitespace-nowrap';
  const chip = (active) =>
    `${chipBase} ${active ? 'bg-black text-white border-black shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`;
  const segBtn = (active) =>
    `px-3 py-1.5 text-sm ${active ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'} `;

  const SORT_LABELS = {
    latest: 'Latest',
    priceLow: 'Price ↑',
    priceHigh: 'Price ↓',
    name: 'Name',
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 my-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <Title text1="SHOP" text2=" COLLECTION" />

        {/* Search + Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <img src={assets.search_icon} alt="Search" className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Segmented sort */}
          <div className="inline-flex rounded border border-gray-300 overflow-hidden bg-white">
            {Object.entries(SORT_LABELS).map(([key, label], idx) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`${segBtn(sort === key)} ${idx !== 0 ? 'border-l border-gray-300' : ''}`}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters: all options visible as chips */}
      <div className="space-y-4 mb-6">
        {/* Category */}
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Category</div>
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setCategory(v)}
                className={chip(category === v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory */}
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Subcategory</div>
          <div className="flex flex-wrap gap-2">
            {['All', ...SUBCATEGORIES].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSubCategory(v)}
                className={chip(subCategory === v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Size</div>
          <div className="flex flex-wrap gap-2">
            {['All', ...SIZES].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSize(v)}
                className={chip(size === v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            onClick={() => { setCategory('All'); setSubCategory('All'); setSize('All'); setQuery(''); setSort('latest'); }}
            className="ml-auto text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {filtered.map((item) => (
          <ProductIteams
            key={item._id}
            _id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-16">No products found. Try adjusting filters.</div>
      )}
    </div>
  );
}

export default Collection;