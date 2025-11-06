import React from 'react';

function NewLaterBox() {
    const OnSubmithandler = (event) => {
        event.preventDefault();
        // Add your subscription logic here
        alert('Subscribed!'); 
    };

    return (
      // Added generous vertical padding and a subtle card-like feel
      <div className='bg-gray-100 py-16 my-16'> 
        <div className='container mx-auto px-4 text-center'>
            
            {/* Enhanced Typography */}
            <p className='text-4xl font-extrabold text-gray-900 mb-2 tracking-tight'>
                <span className='text-red-600'>Subscribe</span> now & get 20% off
            </p>
            <p className='text-lg text-gray-600 max-w-xl mx-auto mb-8'>
                Join our community for exclusive access to new drops, special offers, and styling tips.
            </p>

            {/* Form with Modern Styling */}
            <form 
                onSubmit={OnSubmithandler} 
                className='w-full max-w-lg flex items-center mx-auto shadow-xl rounded-lg overflow-hidden border border-gray-300'
            >
                <input 
                    className='flex-1 px-5 py-4 text-base outline-none focus:ring-0 placeholder-gray-500' 
                    type="email" 
                    placeholder='Enter your best email address' 
                    required 
                />
                <button 
                    type='submit' 
                    className='bg-black text-white px-8 py-4 text-sm font-semibold hover:bg-gray-800 transition duration-300 uppercase tracking-wider'
                >
                    Subscribe
                </button>
            </form>
        </div>
      </div>
    );
}

export default NewLaterBox;