import React from 'react';

function NewLaterBox() {
    const OnSubmithandler = (event) => {
        event.preventDefault();
        // Add your subscription logic here
        alert('Subscribed!'); 
    };

    return (
      <div className='bg-gray-100 py-10 sm:py-16 my-10 sm:my-16'> 
        <div className='container mx-auto px-3 sm:px-4 text-center'>
            
            {/* Enhanced Typography */}
            <p className='text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-2 tracking-tight px-2'>
                <span className='text-red-600'>Subscribe</span> now &<br className='sm:hidden'/> get 20% off
            </p>
            <p className='text-sm sm:text-lg text-gray-600 max-w-xl mx-auto mb-6 sm:mb-8 px-4'>
                Join our community for exclusive access to new drops, special offers, and styling tips.
            </p>

            {/* Form with Modern Styling */}
            <form 
                onSubmit={OnSubmithandler} 
                className='w-full max-w-lg mx-auto px-2 sm:px-0'
            >
                <div className='flex flex-col sm:flex-row gap-0 shadow-xl rounded-lg overflow-hidden border border-gray-300'>
                    <input 
                        className='flex-1 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base outline-none focus:ring-0 placeholder-gray-400' 
                        type="email" 
                        placeholder='Enter your email' 
                        required 
                    />
                    <button 
                        type='submit' 
                        className='bg-black text-white px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold hover:bg-gray-800 transition duration-300 uppercase tracking-wider'
                    >
                        Subscribe
                    </button>
                </div>
            </form>
        </div>
      </div>
    );
}

export default NewLaterBox;