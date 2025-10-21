import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { backendUrl, rupee } from "../App";
import { toast } from "react-toastify";

function ListProduct({ token: tokenProp }) {
  const [list, setList] = useState([]);

  const fetchlist = async () => {
    try {
      const token = tokenProp || localStorage.getItem("token") || "";
      if (!token) {
        toast.error("Unauthorized: please login as admin first");
        return;
      }
      const response = await axios.get(backendUrl + "/api/product/list", {
        headers: { token },
      });
      // Backend returns an array for list; handle both array and wrapped shapes
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setList(data);
      console.log(response.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Unauthorized: invalid or missing admin token");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to fetch products"
        );
      }
    }
  };

  const removeProduct = async (id) => {
    try {
      // Token isn't required by backend for remove in current routes, but pass if available
      const token = tokenProp || localStorage.getItem("token") || "";
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: token ? { token } : {} }
      );

      // Backend returns { message: "product removed" } with 200 status
      if (response.status === 200) {
        const msg = response?.data?.message || "Product removed";
        toast.success(msg);
        // Optimistically update local list so UI reflects removal without manual refresh
        setList((prev) => prev.filter((p) => p?._id !== id));
      } else {
        toast.error(response?.data?.message || "Failed to remove product");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to remove product");
    }
  };
  useEffect(() => {
    fetchlist();
  }, [tokenProp]);
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500">Manage your store catalog</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">Subcategory</th>
                <th className="py-3 pr-4 font-medium">Price</th>
                <th className="py-3 pr-4 font-medium">Sizes</th>
                <th className="py-3 pr-4 font-medium">Best seller</th>
                <th className="py-3 pr-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {Array.isArray(list) && list.length > 0 ? (
                list.map((item, index) => {
                  const key = item?._id || index;
                  const thumb =
                    Array.isArray(item?.image) && item.image.length
                      ? item.image[0]
                      : null;
                  return (
                    <tr key={key} className="border-t border-emerald-100/60">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={item?.name || "product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">
                                No image
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {item?.name || "-"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item?._id || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {item?.category || "-"}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {item?.subCategory || "-"}
                      </td>
                      <td className="py-3 pr-4 text-gray-900">
                        {rupee}
                        {item?.price}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {Array.isArray(item?.size) && item.size.length ? (
                          <div className="flex flex-wrap gap-1">
                            {item.size.map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center justify-center h-6 min-w-6 px-1 rounded border border-gray-200 bg-white text-xs text-gray-700"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {item?.bestSeller ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-medium">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-0 text-right">
                        <button
                          onClick={() => removeProduct(item._id)}
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-6 text-gray-400" colSpan={7}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListProduct;
