import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import AddProduct from "./page/AddProduct";
import ListProduct from "./page/ListProduct";
import OrderProduct from "./page/OrderProduct";
import Login from "./components/Login";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token')? localStorage.getItem('token') : "");
  // Load token from localStorage on mount


  useEffect(()=>{
    localStorage.setItem('token', token)
  },[token])

  return (
    <div className="bg-gray-200 min-h-screen">
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      {token === "" ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <Login setToken={setToken} />
        </div>
      ) : (
        <>
          <Navbar setToken={setToken}/>
          <div className="md:flex md:gap-6">
            {/* Sidebar */}
            <Sidebar />
            {/* Content */}
            <main className="flex-1 min-w-0 pt-6 md:pt-8">
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800 text-base">
                <Routes>
                  <Route path="/add" setToken={setToken}  element={<AddProduct token={token} />} />
                  <Route path="/list" setToken={setToken}  element={<ListProduct token={token} />} />
                  <Route path="/orders" setToken={setToken}  element={<OrderProduct />} />
                </Routes>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
