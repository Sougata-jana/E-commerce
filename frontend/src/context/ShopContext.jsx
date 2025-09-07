import {  createContext, useState } from "react";
import { products } from "../assets/assets";

export const shopContext = createContext()


const ShopContextProvider = (props) =>{
    const currency = '₹'
    const delivery_fee = 40
    const [search, setSearch] = useState('')
    const [showsearch, setShowSearch] = useState(true)
    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showsearch,
        setShowSearch
    }

    return (
    <shopContext.Provider value={value}>
        {props.children}
    </shopContext.Provider>
    )
}

export default ShopContextProvider