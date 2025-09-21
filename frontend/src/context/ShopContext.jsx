import {  createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const shopContext = createContext()


const ShopContextProvider = (props) =>{
    const currency = '₹'
    const delivery_fee = 40
    const [search, setSearch] = useState('')
    const [showsearch, setShowSearch] = useState(true)
    const [cartItem, setCartItem] = useState({})
    const navigate = useNavigate()

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

    // Offer helpers
    const extractPercent = (raw) => {
        if (typeof raw === 'number') return raw
        if (raw == null) return null
        const m = String(raw).match(/(\d+(?:\.\d+)?)/)
        return m ? parseFloat(m[1]) : null
    }

    const deriveStablePercent = (id) => {
        const s = String(id || '')
        let sum = 0
        for (let i = 0; i < s.length; i++) sum = (sum + s.charCodeAt(i)) % 997
        return 10 + (sum % 41) // 10..50
    }

    const getOfferPercentForProduct = (prod) => {
        if (!prod) return 0
        const p = extractPercent(prod.offer)
        const percent = p == null || isNaN(p) ? deriveStablePercent(prod._id) : p
        return Math.max(0, Math.min(90, percent))
    }

    const getDiscountedUnitPrice = (prod) => {
        if (!prod) return 0
        const percent = getOfferPercentForProduct(prod)
        const price = Number(prod.price) || 0
        return Math.round(price * (1 - percent / 100))
    }

    const getCartSubtotal = () => {
        // Original (without discount)
        let subtotal = 0
        for (const id in cartItem) {
            const product = (products || []).find(p => p._id === id)
            if (!product) continue
            for (const size in cartItem[id]) {
                const qty = cartItem[id][size]
                subtotal += (Number(product.price) || 0) * qty
            }
        }
        return subtotal
    }

    const getCartSubtotalDiscounted = () => {
        // Discounted subtotal using offer percent
        let subtotal = 0
        for (const id in cartItem) {
            const product = (products || []).find(p => p._id === id)
            if (!product) continue
            const unit = getDiscountedUnitPrice(product)
            for (const size in cartItem[id]) {
                const qty = cartItem[id][size]
                subtotal += unit * qty
            }
        }
        return subtotal
    }

    const getCartSavings = () => {
        const full = getCartSubtotal()
        const disc = getCartSubtotalDiscounted()
        return Math.max(0, full - disc)
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
        getCartSubtotalDiscounted,
        getCartSavings,
        getOfferPercentForProduct,
        getDiscountedUnitPrice,
        getCartCount,
        navigate
    }

    return (
    <shopContext.Provider value={value}>
        {props.children}
    </shopContext.Provider>
    )
}

export default ShopContextProvider