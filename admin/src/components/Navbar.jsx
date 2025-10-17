import React from 'react';
import { assets } from '../assets/assets';

// Simple Navbar: Logo on the left, Logout button on the right
export default function Navbar({ onLogout, setToken }) {
  const handleLogout = () => {
    // Minimal, optional logout side-effect
    try { localStorage.removeItem('token'); } catch {}
    if (typeof setToken === 'function') setToken('');
    if (typeof onLogout === 'function') onLogout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={assets?.Logo} alt="Logo" className="h-8 w-8" />
          <span className="text-sm font-semibold text-gray-700">Admin Panel</span>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black"
          aria-label="Logout"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}