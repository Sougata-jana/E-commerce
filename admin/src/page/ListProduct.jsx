import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App"; // Assuming rupee is also imported from App
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // Assuming assets include a placeholder for product image if needed
import { useNavigate } from "react-router-dom";

// Placeholder for rupee symbol if not globally available
const rupee = "₹";

function ListProduct({ token: tokenProp }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- Data Fetching ---
  const fetchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = tokenProp || localStorage.getItem("token") || "";
      if (!token) {
        setError("Authentication token missing. Please log in as admin.");
        toast.error("Unauthorized: please login as admin first");
        setLoading(false);
        return;
      }
      const response = await axios.get(backendUrl + "/api/product/list", {
        headers: { token },
      });

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setList(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      if (err?.response?.status === 401) {
        setError("Unauthorized: invalid or missing admin token.");
        toast.error("Unauthorized: invalid or missing admin token");
      } else {
        setError(err?.response?.data?.message || "Failed to fetch products.");
        toast.error(err?.response?.data?.message || "Failed to fetch products");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Product Removal ---
  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    toast.info("Deleting product...");
    try {
      const token = tokenProp || localStorage.getItem("token") || "";
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: token ? { token } : {} }
      );

      if (response.status === 200) {
        const msg = response?.data?.message || "Product removed successfully!";
        toast.success(msg);
        setList((prev) => prev.filter((p) => p?._id !== id));
      } else {
        toast.error(response?.data?.message || "Failed to remove product.");
      }
    } catch (err) {
      console.error("Error removing product:", err);
      toast.error(err?.response?.data?.message || "Failed to remove product due to an error.");
    }
  };

  useEffect(() => {
    fetchlist();
  }, [tokenProp]);

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h3 className="text-3xl font-semibold text-gray-900 mb-4">Loading Products...</h3>
        <p className="text-gray-600">Please wait while we fetch your product catalog.</p>
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // --- Error State UI ---
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-red-50 rounded-lg shadow-md border border-red-200">
        <h3 className="text-3xl font-semibold text-red-700 mb-4">Error Loading Products</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchlist}
          className="mt-8 px-6 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --- Main Product List UI ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Product Catalog</h1>
            <p className="text-lg text-gray-600 mt-1">Manage all your store's products and inventory.</p>
          </div>
          {/* Optional: Add a "Add New Product" button here */}
          <button
             onClick={() => navigate('/add')} 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Product
          </button>
        </div>

        {/* Product Table */}
        <div className="mt-6 overflow-x-auto">
          {Array.isArray(list) && list.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Seller</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {list.map((item) => {
                  const key = item?._id;
                  const thumb =
                    Array.isArray(item?.image) && item.image.length
                      ? item.image[0]
                      : assets.no_image_placeholder; // Use a placeholder image from assets if available, or a default string
                  return (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 h-14 w-14 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={item?.name || "product image"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">No Image</span>
                            )}
                          </div>
                          <div>
                            <div className="text-base font-medium text-gray-900 line-clamp-1">
                              {item?.name || "Untitled Product"}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              ID: {item?._id ? item._id.substring(0, 8) + "..." : "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {item?.category || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {item?.subCategory || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {rupee}{item?.price ? item.price.toFixed(2) : "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Array.isArray(item?.size) && item.size.length ? (
                          <div className="flex flex-wrap gap-1">
                            {item.size.map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item?.bestSeller ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            // onClick={() => navigate(`/edit-product/${item._id}`)} // Optional: Add an Edit button
                            type="button"
                            className="text-indigo-600 hover:text-indigo-900 px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeProduct(item._id)}
                            type="button"
                            className="text-red-600 hover:text-red-900 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            // Empty State inside the table context
            <div className="py-12 text-center bg-white rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new product.
              </p>
              <div className="mt-6">
                <button
                  // onClick={() => navigate('/add-product')}
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListProduct;