import React, { useContext } from 'react'
import { shopContext } from '../context/ShopContext'
import Title from './Title'

function NewCollection() {
    const {products} = useContext(shopContext)

    
  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1={"LATEST"} text2={" COLLECTION"}/>

        </div>
    </div>
  )
}

export default NewCollection