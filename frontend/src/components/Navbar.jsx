import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext.jsx";
function Navbar() {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, clearCart } =
    useContext(shopContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    try { sessionStorage.removeItem("token"); } catch {}
    setToken("");
    clearCart();
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [visible]);
  return (
    <div className="relative z-[999] flex items-center justify-between py-5 font-medium ">
      <Link to={"/"}>
        <img src={assets.Logo} className="w-30" alt="" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-md text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1 ">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-5">
        <img
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          src={assets.search_icon}
          alt="Open search"
          className="w-7 cursor-pointer"
        />

        <div className="group relative">
            <img
            onClick={()=> token ? null : navigate('/login')}
              src={assets.profile_icon}
              alt=""
              className="w-7 cursor-pointer"
            />
            {token && 
            
            <div className={`group-hover:block hidden absolute right-0 top-full mt-2 bg-white shadow-md rounded-md p-2 z-[999]`}
          >
            <div className="flex flex-col w-36 gap-5 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">MY Profile</p>
              <p onClick={()=> navigate('/orders')} className="cursor-pointer hover:text-black">Orders</p>
              <p
                onClick={handleLogout}
                className="cursor-pointer hover:text-black"
              >
                Logout
              </p>
            </div>
          </div>}

        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="" className="w-8 cursor-pointer" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => {
            setVisible(true);
            setShowSearch(false);
          }}
          src={assets.menu_bar_icon}
          alt="Open menu"
          className="w-7 cursor-pointer sm:hidden"
        />
      </div>
      {/* Mobile overlay */}
      <div
        onClick={() => setVisible(false)}
        className={`${
          visible ? "fixed" : "hidden"
        } inset-0 z-40 bg-black/40 backdrop-blur-[1px] sm:hidden`}
        aria-hidden="true"
      />
      {/* Slide-in drawer (mobile) */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out sm:hidden ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link
            to="/"
            onClick={() => setVisible(false)}
            className="flex items-center gap-2"
          >
            <img src={assets.Logo} className="w-24" alt="Logo" />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setVisible(false)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <img src={assets.cancel_icon} alt="Close" className="w-4 h-4" />
          </button>
        </div>
        <nav className="p-2 text-gray-700">
          <NavLink
            onClick={() => setVisible(false)}
            to="/"
            className={({ isActive }) =>
              `block py-3 px-4 rounded hover:bg-gray-100 ${
                isActive ? "font-semibold text-black" : "text-gray-700"
              }`
            }
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/collection"
            className={({ isActive }) =>
              `block py-3 px-4 rounded hover:bg-gray-100 ${
                isActive ? "font-semibold text-black" : "text-gray-700"
              }`
            }
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/about"
            className={({ isActive }) =>
              `block py-3 px-4 rounded hover:bg-gray-100 ${
                isActive ? "font-semibold text-black" : "text-gray-700"
              }`
            }
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/contact"
            className={({ isActive }) =>
              `block py-3 px-4 rounded hover:bg-gray-100 ${
                isActive ? "font-semibold text-black" : "text-gray-700"
              }`
            }
          >
            CONTACT
          </NavLink>
        </nav>
      </aside>
    </div>
  );
}

export default Navbar;
