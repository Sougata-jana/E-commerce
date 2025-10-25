import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./page/Home";
import About from "./page/About";
import Contact from "./page/Contact";
import Collection from "./page/Collection";
import Login from "./page/Login";
import Order from "./page/Order";
import Orders from "./page/Orders";
import Cart from "./page/Cart";
import PlaceOrder from "./page/PlaceOrder";
import Navbar from "./components/Navbar";
import Product from "./page/Product";
import Footer from "./components/Footer";
import SearchBox from "./components/SearchBox";

function App() {
  const location = useLocation();
  const pathname = location.pathname;
  const showSearchOnRoute = pathname === "/collection";
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-[#f2e8cf]">
      <Navbar />
      {showSearchOnRoute && <SearchBox />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/:orderId" element={<Order />} />
        <Route path="/product/:productID" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
      </Routes>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
