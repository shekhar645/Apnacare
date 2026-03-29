import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { backendUrl, setToken } = useContext(AppContext)
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully! 🎉')
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Welcome back to ApnaCare! 👋')
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center py-10'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-3xl shadow-2xl p-8 border border-gray-100'>
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
              <span className='text-white text-3xl'>🏥</span>
            </div>
            <h2 className='text-2xl font-bold text-gray-800'>
              {state === 'Login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className='text-gray-500 mt-1 text-sm'>
              {state === 'Login' ? 'Login to book your appointments' : 'Join ApnaCare today — it\'s free!'}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
            {state === 'Sign Up' && (
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Full Name</label>
                <input
                  type='text'
                  placeholder='Enter your full name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all'
                  required
                />
              </div>
            )}

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Email Address</label>
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Password</label>
              <input
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all'
                required
              />
            </div>

            {state === 'Login' && (
              <p className='text-right text-sm text-blue-600 cursor-pointer hover:underline'>Forgot password?</p>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl mt-2 text-base disabled:opacity-70'>
              {loading ? 'Please wait...' : state === 'Login' ? 'Login to ApnaCare' : 'Create My Account'}
            </button>
          </form>

          <div className='flex items-center gap-3 my-6'>
            <div className='flex-1 h-px bg-gray-200'></div>
            <span className='text-gray-400 text-sm'>or</span>
            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          <p className='text-center text-sm text-gray-600'>
            {state === 'Login' ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => setState(state === 'Login' ? 'Sign Up' : 'Login')}
              className='text-blue-600 font-semibold cursor-pointer hover:underline'>
              {state === 'Login' ? 'Sign Up Free' : 'Login'}
            </span>
          </p>
        </div>

        <div className='flex items-center justify-center gap-6 mt-6'>
          <div className='flex items-center gap-1.5 text-gray-400 text-xs'><span>🔒</span><span>Secure Login</span></div>
          <div className='flex items-center gap-1.5 text-gray-400 text-xs'><span>✅</span><span>Verified Doctors</span></div>
          <div className='flex items-center gap-1.5 text-gray-400 text-xs'><span>🏥</span><span>Trusted Platform</span></div>
        </div>
      </div>
    </div>
  )
}

export default Login