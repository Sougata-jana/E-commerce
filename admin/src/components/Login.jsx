import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

export default function Login({setToken}) {
  // UI-only toggles
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Presentational only – no submit logic

  const onSubmithandler = async (e) =>{
    try {
        e.preventDefault();

        const response = await axios.post(backendUrl + '/api/user/admin',{email,password} )
        if(response.data.success){
            setToken(response.data.token)
        }else{
            toast.error(response.data.message)
        }
    } catch (error) {
        console.error(error);
        toast.error("Something went wrong in login")
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Background flair */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-sky-50" />

      <div className="grid md:grid-cols-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Brand panel (hidden on small screens) */}
        <div className="relative hidden md:flex flex-col gap-4 justify-between bg-slate-900 text-white p-8">
          <div>
            <div className="flex items-center gap-3">
              <img src={assets?.Logo} alt="Logo" className="h-10 w-10 rounded" />
              <div>
                <p className="text-lg font-semibold">Admin Panel</p>
                <p className="text-xs text-white/70">Secure access</p>
              </div>
            </div>
            <div className="mt-8 space-y-3 text-sm text-white/80">
              <p>• Manage products and orders</p>
              <p>• Track performance</p>
              <p>• Configure store settings</p>
            </div>
          </div>
          <div className="pointer-events-none select-none">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-400 to-cyan-400 blur-2xl opacity-40" />
          </div>
        </div>

        {/* Form panel */}
        <div className="p-6 sm:p-8">
          <div className="md:hidden mb-6 flex items-center gap-3">
            <img src={assets?.Logo} alt="Logo" className="h-10 w-10 rounded" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Admin Sign in</h1>
              <p className="text-xs text-gray-500">Use your admin credentials</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmithandler}>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
              <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
                id="email"
                type="email"
                autoComplete="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                value={password}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 pr-10"
                  placeholder="••••••••"
                  required
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <span className="text-sm text-gray-400">Forgot password?</span>
            </div>

            <button
              type="submit"
              className="w-full inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500 text-center">Protected admin area</p>
        </div>
      </div>
    </div>
  );
}