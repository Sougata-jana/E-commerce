import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from "./page/Home"
import About from './page/About'
import Contact from './page/Contact'
import Collection from './page/Collection'
import Login from './page/Login'
import Order from './page/Order'
import Cart from './page/Cart'
import PlaceOrder from './page/PlaceOrder'
import Navbar from './components/Navbar'
import Product from './page/Product'

function App() {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' >
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/collection' element={<Collection/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/order' element={<Order/>}/>
        <Route path='/product/:productID' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/placeorder' element={<PlaceOrder/>}/>
      </Routes>

    </div>
  )
}

export default App