import React from 'react'
import { assets } from '../assets/assets'

function Contact() {
  const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-black/10 focus:border-black/40 outline-none bg-white'

  return (
    <div className='max-w-6xl mx-auto px-6 lg:px-10 my-10'>
      {/* Hero */}
      <section className='relative overflow-hidden rounded-2xl p-6 sm:p-8 shadow-md bg-gradient-to-r from-amber-100 via-rose-100 to-indigo-100'>
        <div className='relative flex items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900'>We’re here to help</h1>
            <p className='text-gray-700 mt-1 max-w-prose'>Questions, feedback, or an issue with your order? Reach out—our team responds fast.</p>
            <div className='mt-3 flex flex-wrap gap-2 text-[11px]'>
              {['Avg. response: < 5 min','24/7 support','Hassle-free help'].map(b => (
                <span key={b} className='px-3 py-1 rounded-full bg-white/70 text-gray-800 shadow-sm'>
                  {b}
                </span>
              ))}
            </div>
          </div>
          <img src={assets.support_icon} alt='Support' className='hidden sm:block w-12 h-12 opacity-90' />
          <div className='pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/50 blur-2xl' />
          <div className='pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-white/40 blur-2xl' />
        </div>
      </section>

      {/* Methods */}
      <section className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[{
          title: 'Chat with us',
          desc: '24/7 live support',
          extra: 'Avg. response < 5 min'
        },{
          title: 'Email',
          desc: 'support@example.com',
          extra: 'We reply within 12 hours'
        },{
          title: 'Call',
          desc: '+91 98765 43210',
          extra: 'Mon–Sat, 9am–7pm'
        }].map((m) => (
          <div key={m.title} className='rounded-xl bg-white shadow-md p-5 hover:shadow-lg transition'>
            <div className='flex items-start justify-between'>
              <div>
                <div className='text-sm font-semibold text-gray-900'>{m.title}</div>
                <div className='text-sm text-gray-700 mt-1'>{m.desc}</div>
              </div>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
                •
              </span>
            </div>
            <div className='text-xs text-gray-500 mt-2'>{m.extra}</div>
          </div>
        ))}
      </section>

      {/* Form */}
      <section className='mt-8 grid grid-cols-1 gap-6'>
        <form className='rounded-2xl bg-white shadow-md p-6 space-y-4'>
          <div>
            <label className='text-sm text-gray-600'>Full name</label>
            <input className={inputCls} placeholder='John Doe' />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm text-gray-600'>Email</label>
              <input className={inputCls} placeholder='you@example.com' />
            </div>
            <div>
              <label className='text-sm text-gray-600'>Phone</label>
              <input className={inputCls} placeholder='+91 XXXXX XXXXX' />
            </div>
          </div>
          <div>
            <label className='text-sm text-gray-600'>Subject</label>
            <input className={inputCls} placeholder='How can we help?' />
          </div>
          <div>
            <label className='text-sm text-gray-600'>Message</label>
            <textarea rows={5} className={inputCls} placeholder='Write your message here...'></textarea>
          </div>
          <button type='button' className='w-full px-4 py-2.5 rounded-full bg-gradient-to-r from-black to-gray-800 text-white hover:opacity-90'>Send message</button>
          <p className='text-xs text-gray-500'>We’ll never share your details. By contacting us, you agree to our privacy policy.</p>
        </form>
      </section>
    </div>
  )
}

export default Contact