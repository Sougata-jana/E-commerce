import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'; // Ensure assets.support_icon is a good icon
// Assuming you have relevant icons in your assets for chat, email, call if desired,
// otherwise the default '•' will be replaced by a placeholder icon.

// Helper component for Contact Method Cards (for reusability and cleaner code)
const ContactMethodCard = ({ icon, title, description, extraInfo, link }) => (
    <div className='bg-white rounded-2xl shadow-lg p-7 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
        <div className='flex items-center justify-center mb-5'>
            {/* Placeholder icon - replace with actual icons from assets if available */}
            {icon ? (
                <img src={icon} alt={title} className='w-16 h-16 object-contain text-indigo-600' />
            ) : (
                <span className='inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-4xl font-light'>
                    {title[0]} {/* Fallback to first letter */}
                </span>
            )}
        </div>
        <h3 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h3>
        <p className='text-lg text-gray-700 mb-3'>{description}</p>
        <p className='text-sm text-gray-500 mb-5'>{extraInfo}</p>
        {link && (
            <a href={link} className='inline-block px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300'>
                {title === 'Email' ? 'Send Email' : title === 'Call' ? 'Call Now' : 'Start Chat'}
            </a>
        )}
    </div>
);

function Contact() {
  // Centralized input styles for consistency
  const inputCls = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition duration-200 bg-white shadow-sm';

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20'>

      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-16 text-white mb-16 lg:mb-24'>
        <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left'>
          <div className='max-w-2xl'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4'>
              We're Here to Help You.
            </h1>
            <p className='text-lg sm:text-xl text-gray-100 max-w-prose mb-6'>
              Questions, feedback, or an issue with your order? Reach out—our dedicated team is ready to respond swiftly.
            </p>
            <div className='flex flex-wrap justify-center md:justify-start gap-3 text-sm font-medium'>
              {['Avg. response: < 5 min','24/7 support','Hassle-free help'].map(b => (
                <span key={b} className='px-4 py-2 rounded-full bg-white/20 text-white shadow-sm'>
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className='flex-shrink-0'>
            {/* Using a larger, more prominent support icon */}
            <img src={assets.support_icon} alt='Support team illustration' className='w-32 h-32 md:w-48 md:h-48 object-contain opacity-90' />
          </div>
        </div>
        {/* Subtle background blurs for visual interest */}
        <div className='pointer-events-none absolute -right-1/4 -top-1/4 h-80 w-80 rounded-full bg-white/10 blur-3xl opacity-50' />
        <div className='pointer-events-none absolute -left-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl opacity-50' />
      </section>

      {/* Contact Methods Section */}
      <section className='my-16 lg:my-24'>
        <h2 className='text-4xl font-extrabold text-gray-900 text-center mb-12'>How You Can Reach Us</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <ContactMethodCard
            // icon={assets.chat_icon} // If you have a chat icon
            title='Live Chat'
            description='Get instant support from our team.'
            extraInfo='Avg. response < 5 min'
            link='#' // Link to your chat widget
          />
          <ContactMethodCard
            // icon={assets.email_icon} // If you have an email icon
            title='Email Support'
            description='Send us a detailed message.'
            extraInfo='We reply within 12 hours'
            link='mailto:support@example.com'
          />
          <ContactMethodCard
            // icon={assets.phone_icon} // If you have a phone icon
            title='Call Us'
            description='Speak directly with a support agent.'
            extraInfo='Mon–Sat, 9am–7pm'
            link='tel:+919876543210'
          />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className='my-16 lg:my-24'>
        <h2 className='text-4xl font-extrabold text-gray-900 text-center mb-12'>Send Us a Message</h2>
        <form className='bg-white rounded-3xl shadow-xl p-8 sm:p-10 lg:p-12 space-y-6 max-w-3xl mx-auto border border-gray-100'>
          
          <div>
            <label htmlFor='fullName' className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
            <input type='text' id='fullName' className={inputCls}  required />
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
              <input type='email' id='email' className={inputCls}  required />
            </div>
            <div>
              <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>Phone Number (Optional)</label>
              <input type='tel' id='phone' className={inputCls}  />
            </div>
          </div>
          
          <div>
            <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-2'>Subject</label>
            <input type='text' id='subject' className={inputCls} placeholder='How can we help you today?' required />
          </div>
          
          <div>
            <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>Your Message</label>
            <textarea id='message' rows={6} className={`${inputCls} resize-y`} placeholder='Write your detailed message here...' required></textarea>
          </div>
          
          <button type='submit' className='w-full px-6 py-3.5 rounded-full bg-indigo-600 text-white font-bold text-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01]'>
            Send Message
          </button>
          
          <p className='text-xs text-gray-500 mt-4 text-center'>
            We value your privacy. Your details will never be shared. By contacting us, you agree to our <Link to="/privacy-policy" className="text-indigo-600 hover:underline">privacy policy</Link>.
          </p>
        </form>
      </section>
    </div>
  );
}

export default Contact;