import React, { useContext, useEffect, useState } from 'react';
import { shopContext } from '../context/ShopContext';
import Title from './Title'; // Assuming Title component handles text styling
import ProductIteams from './ProductIteams';

function BestSaller() {
    const { products } = useContext(shopContext);
    const [bestSaller, setBestsaller] = useState([]);

    useEffect(() => {
      const bestproducts = (products || []).filter((item) => item?.bestSeller === true || item?.bestseller === true);
      setBestsaller(bestproducts.slice(0, 10));
    }, [products]);

    return (
      <div className='container mx-auto px-4 py-16 sm:py-20'>
        
        {/* Modern Title Section */}
        <div className='text-center mb-12 text-3xl'>
          <Title text1={"OUR"} text2={" BESTSELLERS"}/>
          <div className='w-24 h-1 bg-black mx-auto mt-2 rounded-full'></div> 
        </div>

        {/* Product Grid - Consistent with NewCollection */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-10'>
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

        {/* View All Button */}
        <div className='text-center mt-12'>
            <button className='bg-black text-white hover:bg-gray-800 transition duration-300 px-8 py-3 font-medium text-sm tracking-wider uppercase'>
                Shop All Bestsellers
            </button>
        </div>
      </div>
    );
}

export default BestSaller;