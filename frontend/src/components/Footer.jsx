import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-white text-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid gap-14 md:grid-cols-3">
        {/* Brand + Description */}
        <div className="max-w-md">
            <Link to="/" className="inline-flex items-center group">
              <img 
                src={assets.Logo} 
                alt="Brand Logo" 
                className=" h-40 w-auto object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-[1.03]" 
                loading="lazy"
                decoding="async"
              />
            </Link>
          <p className="mt-5 text-sm leading-relaxed text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry's standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-sm font-bold tracking-wider text-black mb-5">COMPANY</h3>
          <ul className="space-y-3 text-sm">
            <li><Link className="hover:text-black transition" to="/">Home</Link></li>
            <li><Link className="hover:text-black transition" to="/about">About us</Link></li>
            <li><Link className="hover:text-black transition" to="/delivery">Delivery</Link></li>
            <li><Link className="hover:text-black transition" to="/privacy">Privacy policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold tracking-wider text-black mb-5">GET IN TOUCH</h3>
            <ul className="space-y-3 text-sm">
              <li className="select-all">+91-780-1080-8132</li>
              <li className="break-all">janasougata198@gmail.com</li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black">Instagram</a></li>
            </ul>
        </div>
      </div>
      <hr className="border-gray-200" />
      <div className="text-center text-xs sm:text-sm py-6 text-gray-600">
        Copyright {year} © sougatajana - All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;