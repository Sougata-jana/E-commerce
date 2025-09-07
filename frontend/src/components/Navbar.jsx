import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets.js'
import { Link, NavLink } from 'react-router-dom'
import { shopContext } from '../context/ShopContext.jsx'

function Navbar() {
  const [visible, setVisible] = useState(false)
  const {setShowSearch} = useContext(shopContext)
  return (
    <div  className='flex items-center justify-between py-5 font-medium '>
      <Link to={'/'}>
        <img src={assets.Logo} className='w-18' alt="" />
      </Link>
        <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
            <NavLink to='/' className='flex flex-col items-center gap-1 ' >
            <p>HOME</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/collection' className='flex flex-col items-center gap-1' >
            <p>COLLECTION</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/about' className='flex flex-col items-center gap-1' >
            <p>ABOUT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/contact' className='flex flex-col items-center gap-1' >
            <p>CONTACT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
        </ul>
        <div className='flex items-center gap-5'>

          <img onClick={()=>setShowSearch(true)} src={assets.search_icon} alt="" className='w-7 cursor-pointer'/>

          <div className='group relative'>
            <img src={assets.profile_icon} alt="" className='w-7 cursor-pointer' />
            <div  className='group-hover:block hidden absolute right-0 top-full bg-white shadow-md rounded-md p-2'>
              <div className='flex flex-col w-36 gap-5 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              <p className='cursor-pointer hover:text-black'>MY Profile</p>
              <p className='cursor-pointer hover:text-black'>Orders</p>
              <p className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          </div>
          <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} alt="" className='w-8 cursor-pointer' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>10</p>
          </Link>
          <img onClick={() => setVisible(true)}src={assets.menu_bar_icon} alt="" className='w-7 cursor-pointer sm:hidden' />
        </div>
        {/* sitebar menu will be only small scrieen */}
        <div className={`absolute top-0 bottom-0 right-0 overflow-hidden transition-all bg-white ${visible ? 'w-full' : 'w-0'} `}>
          <div className='flex flex-col text-gray-600'>
            <div onClick={()=> setVisible(false)}className='flex items-center gap-3 p-2 '>
              <img className='h-4 rotate-90' src={assets.droup_down_arrow} alt="" />
              <p>Back</p>
            </div>
            <NavLink onClick={()=>setVisible(false)} className='py-2 px-4 hover:bg-gray-100' to='/'>HOME</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 px-4 hover:bg-gray-100' to='/about'>ABOUT</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 px-4 hover:bg-gray-100' to='/collection'>COLLECTION</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 px-4 hover:bg-gray-100' to='/contact'>CONTACT</NavLink>
          </div>
        </div>
    </div>
  )
}

export default Navbar