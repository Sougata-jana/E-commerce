import React from "react";
import { assets } from "../assets/assets";

import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

// Accept token via prop; fallback to localStorage if not provided
const AddProduct = ({ token: tokenProp }) => {
  // Preview URLs
  const [image1, setImage1] = React.useState(null);
  const [image2, setImage2] = React.useState(null);
  const [image3, setImage3] = React.useState(null);
  const [image4, setImage4] = React.useState(null);
  // Actual file objects for upload
  const [image1File, setImage1File] = React.useState(null);
  const [image2File, setImage2File] = React.useState(null);
  const [image3File, setImage3File] = React.useState(null);
  const [image4File, setImage4File] = React.useState(null);

  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [category, setCategory] = React.useState("Men");
  const [subCategory, setSubcategory] = React.useState("Topwear");
  const [price, setPrice] = React.useState("");
  const [bestSeller, setBestSeller] = React.useState(false);
  const [sizes, setSizes] = React.useState([]);

  // Reusable input styles
  const inputClass =
    "mt-1 block w-full rounded-xl border border-gray-200/80 bg-white/90 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const selectClass =
    "mt-1 block w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2.5 text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const textareaClass =
    "mt-1 block w-full rounded-xl border border-gray-200/80 bg-white/90 px-3 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-28";

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const token = tokenProp || localStorage.getItem("token") || "";

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", desc); // backend expects "description"
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("size", JSON.stringify(sizes)); // backend expects key "size"
      formData.append("bestSeller", String(bestSeller)); // send as string; backend treats only true as true

      if (image1File) formData.append("image1", image1File);
      if (image2File) formData.append("image2", image2File);
      if (image3File) formData.append("image3", image3File);
      if (image4File) formData.append("image4", image4File);

      console.log("Submitting product:", {
        name,
        desc,
        category,
        subCategory,
        price,
        sizes,
        bestSeller,
        tokenPresent: !!token,
      });

      if (!token) {
        console.warn("No admin token found. Please login via /api/user/admin to obtain a token.");
      }

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: { token }, // backend checks req.headers.token
        }
      );

      const msg = response?.data?.message || "Product added";
      toast.success(msg);
      // Reset fields
      setName("");
      setDesc("");
      setCategory("Men");
      setSubcategory("Topwear");
      setPrice("");
      setBestSeller(false);
      setSizes([]);
      setImage1(null);
      setImage2(null);
      setImage3(null);
      setImage4(null);
      setImage1File(null);
      setImage2File(null);
      setImage3File(null);
      setImage4File(null);
      console.log("Add product response:", response.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        console.error(
          "Unauthorized (401). Ensure you're using the ADMIN token from /api/user/admin and it's sent in header 'token'."
        );
        toast.error("Unauthorized: please login as admin first");
      }
      const errMsg = error?.response?.data?.message || error.message || "Failed to add product";
      console.error("Add product failed:", error?.response?.data || error.message);
      toast.error(errMsg);
    }
  };
  return (
    <form onSubmit={onSubmitHandler}>
    <div className="max-w-5xl mx-auto">
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 sm:p-8">
        <h1 className="text-lg font-semibold text-gray-900">Add product</h1>
        <p className="text-sm text-gray-500">
          Fill in the product information below
        </p>

        {/* Uploads */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload images
          </label>
          <div className="flex flex-wrap gap-3">
            <label className="relative flex h-20 w-24 items-center justify-center rounded-lg border-2 border-dashed border-emerald-200/70 text-emerald-600/80 bg-white hover:border-emerald-300 hover:text-emerald-700 cursor-pointer overflow-hidden">
              <input
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setImage1(URL.createObjectURL(f));
                    setImage1File(f);
                  }
                }}
                id="image1"
                name="image1"
                type="file"
                className="hidden"
                accept="image/*"
              />
              {image1 ? (
                <img
                  src={image1}
                  alt="Preview 1"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-xs">
                  <img
                    src={assets.upload_area}
                    alt="Upload"
                    className="w-6 h-6 opacity-80"
                  />
                  Upload
                </div>
              )}
            </label>

            <label className="relative flex h-20 w-24 items-center justify-center rounded-lg border-2 border-dashed border-emerald-200/70 text-emerald-600/80 bg-white hover:border-emerald-300 hover:text-emerald-700 cursor-pointer overflow-hidden">
              <input
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setImage2(URL.createObjectURL(f));
                    setImage2File(f);
                  }
                }}
                id="image2"
                name="image2"
                type="file"
                className="hidden"
                accept="image/*"
              />
              {image2 ? (
                <img
                  src={image2}
                  alt="Preview 2"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-xs">
                  <img
                    src={assets.upload_area}
                    alt="Upload"
                    className="w-6 h-6 opacity-80"
                  />
                  Upload
                </div>
              )}
            </label>
            <label className="relative flex h-20 w-24 items-center justify-center rounded-lg border-2 border-dashed border-emerald-200/70 text-emerald-600/80 bg-white hover:border-emerald-300 hover:text-emerald-700 cursor-pointer overflow-hidden">
              <input
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setImage3(URL.createObjectURL(f));
                    setImage3File(f);
                  }
                }}
                id="image3"
                name="image3"
                type="file"
                className="hidden"
                accept="image/*"
              />
              {image3 ? (
                <img
                  src={image3}
                  alt="Preview 3"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-xs">
                  <img
                    src={assets.upload_area}
                    alt="Upload"
                    className="w-6 h-6 opacity-80"
                  />
                  Upload
                </div>
              )}
            </label>
            <label className="relative flex h-20 w-24 items-center justify-center rounded-lg border-2 border-dashed border-emerald-200/70 text-emerald-600/80 bg-white hover:border-emerald-300 hover:text-emerald-700 cursor-pointer overflow-hidden">
              <input
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setImage4(URL.createObjectURL(f));
                    setImage4File(f);
                  }
                }}
                id="image4"
                name="image4"
                type="file"
                className="hidden"
                accept="image/*"
              />
              {image4 ? (
                <img
                  src={image4}
                  alt="Preview 4"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-xs">
                  <img
                    src={assets.upload_area}
                    alt="Upload"
                    className="w-6 h-6 opacity-80"
                  />
                  Upload
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Name */}
        <div className="mt-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            id="name"
            placeholder="Type here"
            className={inputClass}
          />
        </div>
        {/* Description */}
        <div className="mt-4">
          <label
            htmlFor="desc"
            className="block text-sm font-medium text-gray-700"
          >
            Product description
          </label>
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            id="desc"
            rows="3"
            placeholder="Write content here"
            className={textareaClass}
          ></textarea>
        </div>

        {/* Row: category, subcategory, price */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="cat"
              className="block text-sm font-medium text-gray-700"
            >
              Product category
            </label>
            <select
              onChange={(e) => {
                setCategory(e.target.value);
                // Reset sizes when category changes so options don't mix
                setSizes([]);
              }}
              className={selectClass}
            >
              <option>Women</option>
              <option>Men</option>
              <option>Kids</option>
              <option>Accessories</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="sub"
              className="block text-sm font-medium text-gray-700"
            >
              Sub category
            </label>
            <select
              onChange={(e) => {
                setSubcategory(e.target.value);
                // Reset sizes when sub category changes
                setSizes([]);
              }}
              id="sub"
              className={selectClass}
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Footwear</option>
              <option>Ethnicwear</option>
              <option>Westernwear</option>
              <option>Outerwear</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Product price
            </label>
            <input
            onChange={(e)=> setPrice(e.target.value)}
            value={price}
              type="number"
              id="price"
              placeholder="0.00"
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">Product sizes</p>
          {category === "Kids" ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <div
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("4Y") ? prev.filter((i) => i !== "4Y") : [...prev, "4Y"]
                  )
                }
                className={`inline-flex items-center justify-center h-8 w-12 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("4Y") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                4Y
              </div>
              <div
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("6Y") ? prev.filter((i) => i !== "6Y") : [...prev, "6Y"]
                  )
                }
                className={`inline-flex items-center justify-center h-8 w-12 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("6Y") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                6Y
              </div>
              <div
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("8Y") ? prev.filter((i) => i !== "8Y") : [...prev, "8Y"]
                  )
                }
                className={`inline-flex items-center justify-center h-8 w-12 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("8Y") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                8Y
              </div>
              <div
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("10Y") ? prev.filter((i) => i !== "10Y") : [...prev, "10Y"]
                  )
                }
                className={`inline-flex items-center justify-center h-8 w-14 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("10Y") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                10Y
              </div>
            </div>
          ) : subCategory === "Bottomwear" ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <div
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("30") ? prev.filter((i) => i !== "30") : [...prev, "30"]
                  )
                }
                className={`inline-flex items-center justify-center h-8 w-12 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("30") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                30
              </div>
              <div
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("32") ? prev.filter((i) => i !== "32") : [...prev, "32"]
                  )
                }
                className={`inline-flex items-center justify-center h-8 w-12 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("32") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                32
              </div>
              <div
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("34") ? prev.filter((i) => i !== "34") : [...prev, "34"]
                  )
                }
                className={`inline-flex items-center justify-center h-8 w-12 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("34") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                34
              </div>
              <div
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("36") ? prev.filter((i) => i !== "36") : [...prev, "36"]
                  )
                }
                className={`inline-flex items-center justify-center h-8 w-12 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("36") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                36
              </div>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              <div
                onClick={() =>
                  setSizes((prev) => (prev.includes("S") ? prev.filter((item) => item !== "S") : [...prev, "S"]))
                }
                className={`inline-flex items-center justify-center h-8 w-10 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("S") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                S
              </div>
              <div
                onClick={() =>
                  setSizes((prev) => (prev.includes("M") ? prev.filter((item) => item !== "M") : [...prev, "M"]))
                }
                className={`inline-flex items-center justify-center h-8 w-10 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("M") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                M
              </div>
              <div
                onClick={() =>
                  setSizes((prev) => (prev.includes("L") ? prev.filter((item) => item !== "L") : [...prev, "L"]))
                }
                className={`inline-flex items-center justify-center h-8 w-10 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("L") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                L
              </div>
              <div
                onClick={() =>
                  setSizes((prev) => (prev.includes("XL") ? prev.filter((item) => item !== "XL") : [...prev, "XL"]))
                }
                className={`inline-flex items-center justify-center h-8 w-12 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("XL") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                XL
              </div>
              <div
                onClick={() =>
                  setSizes((prev) => (prev.includes("XXL") ? prev.filter((item) => item !== "XXL") : [...prev, "XXL"]))
                }
                className={`inline-flex items-center justify-center h-8 w-14 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm ${
                  sizes.includes("XXL") ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                XXL
              </div>
            </div>
          )}
        </div>

        {/* Bestseller */}
        <label className="mt-6 flex items-center gap-2 text-sm text-gray-700">
          <input
            onChange={(e) => setBestSeller(prev => !prev)}
            checked={bestSeller}
            type="checkbox"
            className="size-4 rounded-md border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
          />
          Add to bestseller
        </label>

        {/* Add button */}
        <div className="mt-6">
          <button  
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-6 py-2.5 text-sm font-semibold hover:bg-black">
            ADD
          </button>
        </div>
      </div>
    </div>
    </form>
  );
}

export default AddProduct 