import React, { useContext, useEffect, useState } from 'react';
import { shopContext } from '../context/ShopContext';
import Title from './Title'; // Assuming Title component handles text styling
import ProductIteams from './ProductIteams';

function NewCollection() {
    const { products } = useContext(shopContext);
    const [latestProducts, setLeatestProducts] = useState([]);

    useEffect(() => {
      // Sort by date (latest first)
      const sorted = [...(products || [])].sort((a,b)=> (b?.date ?? 0) - (a?.date ?? 0));
      setLeatestProducts(sorted.slice(0,10));
    }, [products]);

    return (
      <div className='container mx-auto px-4 py-16 sm:py-20'>
        
        {/* Modern Title Section */}
        <div className='text-center mb-12 text-3xl'>
          <Title text1={"LATEST"} text2={" DROPS"}/>
          <div className='w-24 h-1 bg-black mx-auto mt-2 rounded-full'></div> 
        </div>

        {/* Product Grid - Increased gap and defined column layout */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-10'>
          {latestProducts.map(item => (
            <ProductIteams
              key={item._id}
              _id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className='text-center mt-12'>
            <button className='border border-black text-black hover:bg-black hover:text-white transition duration-300 px-8 py-3 font-medium text-sm tracking-wider uppercase'>
                View All New Arrivals
            </button>
        </div>
      </div>
    );
}

export default NewCollection;