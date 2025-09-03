import React from 'react'

function Title({text1, text2}) {
  return (
    <div className='inline-flex gap-2 items-center mb-2'>
        <p className='text-gray-500'>{text1}<span className='font-medium text-gray-700'>{text2}</span></p>
        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px]'></p>

    </div>
  )
}

export default Title