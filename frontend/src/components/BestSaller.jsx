import React, { useContext, useEffect, useState } from 'react'
import { shopContext } from '../context/ShopContext'
import Title from './Title'
import ProductIteams from './ProductIteams'

function BestSaller() {
    const {products} = useContext(shopContext)
    const [bestSaller, setBestsaller] = useState([])
    useEffect(()=>{
        const bestproducts = products.filter((item)=>(item.bestseller === true))
        setBestsaller(bestproducts.slice(0,10))
    },[])
  return (
        <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1={"BEST"} text2={" SALLER"}/>

        </div>
                {/* Rendaring products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {bestSaller.map(item => (
            <ProductIteams
              key={item._id}
              _id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
    </div>

  )
}

export default BestSaller