import React from 'react';
import { assets } from '../assets/assets';

export default function AddProduct() {

  const [image1, setImage1] = React.useState(null);
  const [image2, setImage2] = React.useState(null);
  const [image3, setImage3] = React.useState(null);
  const [image4, setImage4] = React.useState(null);

  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [category, setCategory] = React.useState("Men");
  const [subcategory, setSubcategory] = React.useState("Topwear");
  const [price, setPrice] = React.useState("");
  const [sizes, setSizes] = React.useState([]);
  const [bestseller, setBestseller] = React.useState(false);
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 sm:p-8">
        <h1 className="text-lg font-semibold text-gray-900">Add product</h1>
        <p className="text-sm text-gray-500">Fill in the product information below</p>

        {/* Uploads */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload images</label>
          <div className="flex flex-wrap gap-3">
            <label className="relative flex h-20 w-24 items-center justify-center rounded-lg border-2 border-dashed border-emerald-200/70 text-emerald-600/80 bg-white hover:border-emerald-300 hover:text-emerald-700 cursor-pointer overflow-hidden">
              <input onChange={(e)=> { const f=e.target.files?.[0]; if(f) setImage1(URL.createObjectURL(f)); }} id="image1" name="image1" type="file" className="hidden" accept="image/*" />
              {image1 ? (
                <img src={image1} alt="Preview 1" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-xs">
                  <img src={assets.upload_area} alt="Upload" className="w-6 h-6 opacity-80" />
                  Upload
                </div>
              )}
            </label>

            <label className="relative flex h-20 w-24 items-center justify-center rounded-lg border-2 border-dashed border-emerald-200/70 text-emerald-600/80 bg-white hover:border-emerald-300 hover:text-emerald-700 cursor-pointer overflow-hidden">
              <input onChange={(e)=> { const f=e.target.files?.[0]; if(f) setImage2(URL.createObjectURL(f)); }} id="image2" name="image2" type="file" className="hidden" accept="image/*" />
              {image2 ? (
                <img src={image2} alt="Preview 2" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-xs">
                  <img src={assets.upload_area} alt="Upload" className="w-6 h-6 opacity-80" />
                  Upload
                </div>
              )}
            </label>
            <label className="relative flex h-20 w-24 items-center justify-center rounded-lg border-2 border-dashed border-emerald-200/70 text-emerald-600/80 bg-white hover:border-emerald-300 hover:text-emerald-700 cursor-pointer overflow-hidden">
              <input onChange={(e)=> { const f=e.target.files?.[0]; if(f) setImage3(URL.createObjectURL(f)); }} id="image3" name="image3" type="file" className="hidden" accept="image/*" />
              {image3 ? (
                <img src={image3} alt="Preview 3" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-xs">
                  <img src={assets.upload_area} alt="Upload" className="w-6 h-6 opacity-80" />
                  Upload
                </div>
              )}
            </label>
            <label className="relative flex h-20 w-24 items-center justify-center rounded-lg border-2 border-dashed border-emerald-200/70 text-emerald-600/80 bg-white hover:border-emerald-300 hover:text-emerald-700 cursor-pointer overflow-hidden">
              <input onChange={(e)=> { const f=e.target.files?.[0]; if(f) setImage4(URL.createObjectURL(f)); }} id="image4" name="image4" type="file" className="hidden" accept="image/*" />
              {image4 ? (
                <img src={image4} alt="Preview 4" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-xs">
                  <img src={assets.upload_area} alt="Upload" className="w-6 h-6 opacity-80" />
                  Upload
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Name */}
        <div className="mt-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product name</label>
          <input onChange={(e) => setName(e.target.value)} id="name" placeholder="Type here" className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
        {/* Description */}
        <div className="mt-4">
          <label htmlFor="desc" className="block text-sm font-medium text-gray-700">Product description</label>
          <textarea onChange={(e)=> setDesc(e.target.value)} id="desc" rows="3" placeholder="Write content here" className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"></textarea>
        </div>

        {/* Row: category, subcategory, price */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cat" className="block text-sm font-medium text-gray-700">Product category</label>
            <select onChange={(e)=> setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
              <option>Women</option>
              <option>Men</option>
              <option>Kids</option>
              <option>Accessories</option>
            </select>
          </div>
          <div>
            <label htmlFor="sub" className="block text-sm font-medium text-gray-700">Sub category</label>
            <select onChange={(e)=> setSubcategory(e.target.value)} id="sub" className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Footwear</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Product price</label>
            <input id="price" placeholder="25" className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
        </div>

        {/* Sizes */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">Product sizes</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['S','M','L','XL','XXL'].map((s) => (
              <span key={s} className="inline-flex items-center justify-center h-8 w-10 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <label className="mt-6 flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
          Add to bestseller
        </label>

        {/* Add button */}
        <div className="mt-6">
          <button className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-6 py-2.5 text-sm font-semibold hover:bg-black">
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}