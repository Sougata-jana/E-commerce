import React, { useContext, useEffect, useState } from 'react'
import { shopContext } from '../context/ShopContext'
import Title from './Title'
import ProductIteams from './ProductIteams'

function NewCollection() {
    const {products} = useContext(shopContext)
    const [latestProducts, setLeatestProducts] = useState([])

    useEffect(()=>{
      setLeatestProducts(products.slice(0,10))
    },[])
    
  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1={"LATEST"} text2={" COLLECTION"}/>

        </div>
                {/* Rendaring products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {
            latestProducts.map((items,index)=>(
              <ProductIteams key={index} image={items.image} name={items.name} price={items.price}/>
            ))
          }
        </div>
    </div>
  )
}

export default NewCollection