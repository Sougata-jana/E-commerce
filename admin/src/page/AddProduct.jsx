import React from "react";
import { assets } from "../assets/assets";
import { backendUrl,rupee } from "../App";
import axios from "axios";
import { toast } from "react-toastify";


// Helper function to create image file state handlers
const useImageUpload = () => {
  const [imagePreview, setImagePreview] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);
  

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const resetImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  return { imagePreview, imageFile, handleImageChange, resetImage };
};

// Accept token via prop; fallback to localStorage if not provided
const AddProduct = ({ token: tokenProp }) => {
  // Use reusable hook for each image slot
  const {
    imagePreview: image1,
    imageFile: image1File,
    handleImageChange: handleImage1Change,
    resetImage: resetImage1,
  } = useImageUpload();
  const {
    imagePreview: image2,
    imageFile: image2File,
    handleImageChange: handleImage2Change,
    resetImage: resetImage2,
  } = useImageUpload();
  const {
    imagePreview: image3,
    imageFile: image3File,
    handleImageChange: handleImage3Change,
    resetImage: resetImage3,
  } = useImageUpload();
  const {
    imagePreview: image4,
    imageFile: image4File,
    handleImageChange: handleImage4Change,
    resetImage: resetImage4,
  } = useImageUpload();

  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [category, setCategory] = React.useState("Men");
  const [subCategory, setSubcategory] = React.useState("Topwear");
  const [price, setPrice] = React.useState("");
  const [bestSeller, setBestSeller] = React.useState(false);
  const [sizes, setSizes] = React.useState([]);

  // Reusable input styles
  const inputClass =
    "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/90";
  const selectClass =
    "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm outline-none transition duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white";
  const textareaClass =
    "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/90 min-h-[100px]";

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const token = tokenProp || localStorage.getItem("token") || "";

    // Basic validation
    if (!name || !desc || !category || !subCategory || !price || sizes.length === 0) {
      toast.error("Please fill in all product details, including at least one size.");
      return;
    }
    if (!image1File && !image2File && !image3File && !image4File) {
        toast.error("Please upload at least one product image.");
        return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", desc);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("size", JSON.stringify(sizes));
      formData.append("bestSeller", String(bestSeller));

  // Send as image1..image4 to match backend and allow fallback support
  if (image1File) formData.append("image1", image1File);
  if (image2File) formData.append("image2", image2File);
  if (image3File) formData.append("image3", image3File);
  if (image4File) formData.append("image4", image4File);

      if (!token) {
        toast.error("Authentication token missing. Please log in as admin first.");
        return;
      }

      toast.info("Adding product...");
      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message || "Product added successfully!");
        // Reset fields
        setName("");
        setDesc("");
        setCategory("Men");
        setSubcategory("Topwear");
        setPrice("");
        setBestSeller(false);
        setSizes([]);
        resetImage1();
        resetImage2();
        resetImage3();
        resetImage4();
      } else {
        toast.error(response.data?.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Add product failed:", error.response?.data || error.message);
      if (error?.response?.status === 401) {
        toast.error("Unauthorized: invalid or missing admin token. Please login again.");
      } else {
        toast.error(error?.response?.data?.message || "An unexpected error occurred. Failed to add product.");
      }
    }
  };

  const commonSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const kidsSizes = ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y"];
  const bottomwearSizes = ["28", "30", "32", "34", "36", "38", "40"]; // Example sizes

  const getAvailableSizes = () => {
    if (category === "Kids") {
      return kidsSizes;
    }
    if (subCategory === "Bottomwear") {
      return bottomwearSizes;
    }
    return commonSizes; // Default for others
  };

  const handleSizeToggle = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  React.useEffect(() => {
    // Reset sizes when category or subCategory changes to avoid invalid selections
    setSizes([]);
  }, [category, subCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <form onSubmit={onSubmitHandler} className="space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 lg:p-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-lg text-gray-600 mb-8">
            Enter the details to add a new product to your catalog.
          </p>

          {/* Image Uploads */}
          <div>
            <label className="block text-xl font-semibold text-gray-900 mb-4">
              Product Images <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-4">Upload up to 4 images for your product. (First image is primary)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: "image1", preview: image1, file: image1File, handler: handleImage1Change, reset: resetImage1 },
                { id: "image2", preview: image2, file: image2File, handler: handleImage2Change, reset: resetImage2 },
                { id: "image3", preview: image3, file: image3File, handler: handleImage3Change, reset: resetImage3 },
                { id: "image4", preview: image4, file: image4File, handler: handleImage4Change, reset: resetImage4 },
              ].map((imgSlot, index) => (
                <div key={imgSlot.id} className="relative group">
                  <label
                    htmlFor={imgSlot.id}
                    className="relative flex h-32 w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500 bg-gray-50 cursor-pointer overflow-hidden transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <input
                      onChange={imgSlot.handler}
                      id={imgSlot.id}
                      name={imgSlot.id}
                      type="file"
                      className="hidden"
                      accept="image/*"
                    />
                    {imgSlot.preview ? (
                      <>
                        <img
                          src={imgSlot.preview}
                          alt={`Preview ${index + 1}`}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                           <span className="text-white text-sm font-semibold">Change</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-sm font-medium">
                        <img
                          src={assets.upload_area}
                          alt="Upload"
                          className="w-8 h-8 opacity-70 mb-1"
                        />
                        Upload {index === 0 && <span className="font-semibold text-indigo-600">Primary</span>}
                      </div>
                    )}
                  </label>
                  {imgSlot.preview && (
                    <button
                      type="button"
                      onClick={() => imgSlot.reset()}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-600 hover:text-red-600 transition-colors duration-200"
                      aria-label="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-800 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                id="name"
                placeholder="e.g., Essential Ribbed Tee"
                className={inputClass}
                required
              />
            </div>
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-base font-medium text-gray-800 mb-1">
                Product Price ({rupee}) <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type="number"
                id="price"
                placeholder="0.00"
                min="0"
                step="0.01"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label htmlFor="desc" className="block text-base font-medium text-gray-800 mb-1">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              id="desc"
              placeholder="Provide a detailed description of the product..."
              className={textareaClass}
              required
            ></textarea>
          </div>

          {/* Category, Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="cat" className="block text-base font-medium text-gray-800 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                id="cat"
                className={selectClass}
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label htmlFor="sub" className="block text-base font-medium text-gray-800 mb-1">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                onChange={(e) => setSubcategory(e.target.value)}
                value={subCategory}
                id="sub"
                className={selectClass}
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Footwear">Footwear</option>
                <option value="Ethnicwear">Ethnicwear</option>
                <option value="Westernwear">Westernwear</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <p className="block text-base font-medium text-gray-800 mb-2">
              Available Sizes <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {getAvailableSizes().map((sizeOption) => (
                <button
                  key={sizeOption}
                  type="button"
                  onClick={() => handleSizeToggle(sizeOption)}
                  className={`inline-flex items-center justify-center h-10 w-16 rounded-lg border-2 text-sm font-semibold transition-all duration-200
                    ${sizes.includes(sizeOption)
                      ? "border-indigo-500 bg-indigo-500 text-white shadow-md"
                      : "border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>

          {/* Bestseller */}
          <label className="mt-8 flex items-center gap-3 text-base text-gray-800 cursor-pointer">
            <input
              onChange={() => setBestSeller((prev) => !prev)}
              checked={bestSeller}
              type="checkbox"
              className="h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 shadow-sm transition-colors duration-200"
            />
            <span className="font-medium">Mark as Best Seller</span>
            <span className="text-sm text-gray-500">(Highlight this product on your homepage)</span>
          </label>

          {/* Add button */}
          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              ADD PRODUCT
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;