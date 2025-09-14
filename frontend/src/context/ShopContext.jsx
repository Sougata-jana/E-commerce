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
    const addCart = async (itemID, size = 'default', quantity = 1) => {
        const qty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1
        setCartItem(prev => {
            const cartData = structuredClone(prev)
            if (!cartData[itemID]) cartData[itemID] = {}
            if (!cartData[itemID][size]) cartData[itemID][size] = 0
            cartData[itemID][size] += qty
            return cartData
        })
    }

    const decCart = (itemID, size = 'default', quantity = 1) => {
        const qty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1
        setCartItem(prev => {
            const cartData = structuredClone(prev)
            if (!cartData[itemID] || !cartData[itemID][size]) return prev
            cartData[itemID][size] -= qty
            if (cartData[itemID][size] <= 0) delete cartData[itemID][size]
            if (Object.keys(cartData[itemID]).length === 0) delete cartData[itemID]
            return cartData
        })
    }

    const removeCart = (itemID, size = 'default') => {
        setCartItem(prev => {
            const cartData = structuredClone(prev)
            if (cartData[itemID] && cartData[itemID][size] != null) {
                delete cartData[itemID][size]
                if (Object.keys(cartData[itemID]).length === 0) delete cartData[itemID]
            }
            return cartData
        })
    }

    const clearCart = () => setCartItem({})

    const getCartSubtotal = () => {
        let subtotal = 0
        for (const id in cartItem) {
            const product = (products || []).find(p => p._id === id)
            if (!product) continue
            for (const size in cartItem[id]) {
                const qty = cartItem[id][size]
                subtotal += (product.price || 0) * qty
            }
        }
        return subtotal
    }



    const getCartCount = () =>{
        let totalCount = 0 
        for(const items in cartItem){
            for(const item in cartItem[items]){
                try {
                    if(cartItem[items][item] > 0){
                        totalCount += cartItem[items][item]
                    }           
                } catch (error) {
                    
                }
            }

    }
    return totalCount
}

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showsearch,
        setShowSearch,
        cartItem,
        addCart,
        decCart,
        removeCart,
        clearCart,
        getCartSubtotal,
        getCartCount,
    }

    return (
    <shopContext.Provider value={value}>
        {props.children}
    </shopContext.Provider>
    )
}

export default ShopContextProvider