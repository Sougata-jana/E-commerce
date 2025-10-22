import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { shopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import axios from 'axios'


function Login() {
  const navigate = useNavigate()
  const { token, setToken, backendUrl } = useContext(shopContext)
  const [mode, setMode] = useState('signin') // default to signup first, then signin
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [name, setName] = useState('')
 



  const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-black/10 focus:border-black/40 outline-none bg-white'

  const validate = () => {
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!okEmail) { toast.error('Enter a valid email address'); return false }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return false }
    if (mode === 'signin') {
      if (!email.trim() || !password) { toast.error('Please enter email and password'); return false }
      return true
    }
    // signup
    if (!name.trim()) { toast.error('Please enter your full name'); return false }
    return true
  }



  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!validate()) return
      if (mode === 'signup') {
        // Sign up → POST /api/user/register
        const res = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        const data = res?.data
        if (data?.success || data?.statusCode === 201) {
          // Do not auto-login after register; move to sign-in step
          toast.success('Account created! Please sign in.')
          setMode('signin')
          setPassword('')
          return
        }
        toast.error(data?.message || 'Registration failed')
      } else {
        // Sign in → POST /api/user/login
        const res = await axios.post(backendUrl + '/api/user/login', { email, password })
        const data = res?.data
        const t = data?.data?.token || data?.token
        if (t) {
          setToken(t)
          localStorage.setItem('token', t)
          toast.success('Welcome back!')
          // navigate('/')
          return
        }
        console.log(res.data);
        
        toast.error(data?.message || 'Login failed')
      }
      
    } catch (error) {
      // Friendly message for invalid credentials during sign in
      const status = error?.response?.status
      if (mode === 'signin' && (status === 400 || status === 401 || status === 404)) {
        toast.error('Invalid email or password')
      } else {
        const msg = error?.response?.data?.message || error.message || 'Request failed'
        toast.error(msg)
      }
      console.error('Auth error:', error?.response?.data || error)
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])
  return (
    <div className='min-h-[70vh] grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-sm bg-white'>
      {/* Visual side */}
      <div className='relative hidden md:block'>
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' />
        <div className='absolute inset-0 mix-blend-overlay' style={{background:'radial-gradient(650px 300px at 80% 20%, rgba(255,255,255,0.25), transparent)'}} />
        <div className='relative h-full w-full p-8 flex flex-col justify-between text-white'>
          <Link to='/' className='inline-flex items-center gap-2'>
            <img src={assets.Logo} alt='Logo' className='h-10 w-auto drop-shadow' />
          </Link>
          <div>
            <h1 className='text-3xl font-semibold'>Welcome back</h1>
            <p className='mt-2 text-white/90 max-w-sm'>Sign in to access your cart, track orders, and get personalized picks.</p>
          </div>
          <ul className='text-sm text-white/90 list-disc ps-5 space-y-1'>
            <li>Exclusive member-only deals</li>
            <li>Faster checkout</li>
            <li>Order history</li>
          </ul>
        </div>
      </div>

      {/* Form side */}
      <div className='p-6 sm:p-8 lg:p-10'>
        <div className='mx-auto w-full max-w-md'>
          <div className='mb-6 flex items-center gap-3 md:hidden'>
            <img src={assets.Logo} alt='Logo' className='h-8 w-auto' />
            <span className='text-lg font-medium'>Welcome back</span>
          </div>

          {/* Toggle */}
          <div className='mb-6 inline-flex rounded-full bg-gray-100 p-1'>
            <button type='button' onClick={()=>setMode('signin')} className={`px-4 py-1.5 rounded-full text-sm ${mode==='signin'?'bg-white shadow font-medium':'text-gray-600'}`}>Sign in</button>
            <button type='button' onClick={()=>setMode('signup')} className={`px-4 py-1.5 rounded-full text-sm ${mode==='signup'?'bg-white shadow font-medium':'text-gray-600'}`}>Create account</button>
          </div>

          <form onSubmit={onSubmit} className='space-y-5'>
            {mode === 'signup' && (
              <div>
                <label className='text-sm text-gray-600'>Full name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} className={inputCls} />
              </div>
            )}
            <div>
              <label className='text-sm text-gray-600'>Email address</label>
              <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)} className={inputCls}  />
            </div>
            <div>
              <div className='flex items-center justify-between'>
                <label className='text-sm text-gray-600'>Password</label>
                <button type='button' onClick={()=>setShow(s=>!s)} className='text-xs text-gray-600 hover:text-black'>
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className='relative'>
                <input type={show?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} className={`${inputCls} pr-10`} placeholder='••••••••' />
                <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
                  {show ? (
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5'>
                      <path d='M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-2.192-2.193c1.212-1.04 2.182-2.263 2.84-3.56a1.78 1.78 0 0 0 0-1.568C20.93 8.104 17.69 5.25 12 5.25c-1.732 0-3.245.29-4.545.802L3.53 2.47ZM12 6.75c5.03 0 7.77 2.44 9.17 5.113a.28.28 0 0 1 0 .274c-.545 1.064-1.38 2.133-2.483 3.072l-2.61-2.61a4.5 4.5 0 0 0-6.225-6.225l-1.28-1.28c1.082-.232 2.28-.344 3.428-.344ZM14.704 16.12l-2.574-2.573a1.5 1.5 0 0 1-2.677-1.017 1.5 1.5 0 0 1 2.21-1.341l-1.29-1.29a3 3 0 0 0-2.055 3.664 3 3 0 0 0 4.386 1.557Z'/>
                      <path d='M6.085 9.035 4.67 7.62C3.52 8.505 2.655 9.57 2.13 10.637a1.78 1.78 0 0 0 0 1.569C3.07 14.896 6.31 17.75 12 17.75c1.423 0 2.683-.18 3.806-.505l-1.602-1.602A9.48 9.48 0 0 1 12 16.25c-5.03 0-7.77-2.44-9.17-5.114a.28.28 0 0 1 0-.273c.459-.897 1.123-1.79 1.956-2.528Z'/>
                    </svg>
                  ) : (
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5'>
                      <path d='M12 5.25c-5.69 0-8.93 2.854-10.37 5.887a1.78 1.78 0 0 0 0 1.568C3.07 15.896 6.31 18.75 12 18.75s8.93-2.854 10.37-5.887a1.78 1.78 0 0 0 0-1.568C20.93 8.104 17.69 5.25 12 5.25Zm0 10.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z'/>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            {mode === 'signin' && (
              <div className='flex items-center justify-between'>
                <label className='inline-flex items-center gap-2 text-sm text-gray-700'>
                  <input type='checkbox' checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
                  Remember me
                </label>
                <button type='button' className='text-sm text-gray-700 hover:underline'>Forgot password?</button>
              </div>
            )}

            <button type='submit' className='w-full px-4 py-2.5 rounded-full bg-black text-white hover:opacity-90'>
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {/* Removed guest option as requested */}
        </div>
      </div>
    </div>
  )
}

export default Login