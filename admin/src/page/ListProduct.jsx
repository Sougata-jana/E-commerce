import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

function ListProduct({ token: tokenProp }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const token = tokenProp || localStorage.getItem('token') || ''

  const fetchList = async () =>{
    try {
      if (!token) {
        toast.error('Unauthorized: please login as admin first')
        return
      }
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { token },
      })
      const data = Array.isArray(response.data) ? response.data : []
      setList(data)
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Unauthorized: invalid or missing admin token')
      } else {
        toast.error(error?.response?.data?.message || 'Failed to fetch products')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshKey])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(p =>
      p?.name?.toLowerCase().includes(q) ||
      p?.category?.toLowerCase().includes(q) ||
      p?.subCategory?.toLowerCase().includes(q)
    )
  }, [list, query])

  const handleDelete = async (id) => {
    if (!id) return
    const ok = window.confirm('Are you sure you want to delete this product?')
    if (!ok) return
    try {
      await axios.post(backendUrl + '/api/product/remove', { id }, {
        headers: { token },
      })
      toast.success('Product removed')
      setRefreshKey(k => k + 1)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove product')
    }
  }

  const formatCurrency = (n) => {
    const num = Number(n)
    if (Number.isNaN(num)) return '-'
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(num)
  }

  const formatDate = (ts) => {
    if (!ts) return '-'
    try { return new Date(ts).toLocaleDateString() } catch { return '-' }
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500">Manage your store catalog</p>
          </div>
          <div className="max-w-xs w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, subcategory"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
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
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 pr-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {loading ? (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={8}>Loading…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="py-6 text-gray-400" colSpan={8}>No products found</td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const thumb = Array.isArray(p?.image) && p.image.length ? p.image[0] : null
                  return (
                    <tr key={p._id} className="border-t border-emerald-100/60">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                            {thumb ? (
                              <img src={thumb} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs text-gray-400">No image</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">{p.name}</div>
                            <div className="text-xs text-gray-500">{p._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{p.category || '-'}</td>
                      <td className="py-3 pr-4 text-gray-700">{p.subCategory || '-'}</td>
                      <td className="py-3 pr-4 text-gray-900">{formatCurrency(p.price)}</td>
                      <td className="py-3 pr-4 text-gray-700">
                        {Array.isArray(p.size) && p.size.length ? (
                          <div className="flex flex-wrap gap-1">
                            {p.size.map((s) => (
                              <span key={s} className="inline-flex items-center justify-center h-6 min-w-6 px-1 rounded border border-gray-200 bg-white text-xs text-gray-700">{s}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {p.bestSeller ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-medium">Yes</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">No</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{formatDate(p.date)}</td>
                      <td className="py-3 pr-0 text-right">
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ListProduct