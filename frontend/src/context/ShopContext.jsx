import {  createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";

export const shopContext = createContext()


const ShopContextProvider = (props) =>{
    const currency = '₹'
    const delivery_fee = 40
    const [search, setSearch] = useState('')
    const [showsearch, setShowSearch] = useState(true)
    const [cartItem, setCartItem] = useState({})

    // Add to cart: supports quantity and default size key
    const addCart = (itemID, size = 'default', quantity = 1) => {
        const qty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1
        setCartItem(prev => {
            const cartData = structuredClone(prev)
            if (!cartData[itemID]) cartData[itemID] = {}
            if (!cartData[itemID][size]) cartData[itemID][size] = 0
            cartData[itemID][size] += qty
            return cartData
        })
    }
    useEffect(()=>{
        console.log(cartItem);
        
    },[cartItem])
    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showsearch,
        setShowSearch,
        cartItem,
        addCart
    }

    return (
    <shopContext.Provider value={value}>
        {props.children}
    </shopContext.Provider>
    )
}

export default ShopContextProvider