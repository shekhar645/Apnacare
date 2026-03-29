import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({ setAToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const backendUrl = 'http://localhost:5000'

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
      if (data.success) {
        localStorage.setItem('aToken', data.token)
        setAToken(data.token)
        toast.success('Welcome to ApnaCare Admin! 🎉')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='w-full max-w-md'>

        {/* Logo */}
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
            <span className='text-white text-3xl font-bold'>A</span>
          </div>
          <h1 className='text-2xl font-bold text-gray-800'>ApnaCare Admin</h1>
          <p className='text-gray-500 text-sm mt-1'>Sign in to manage your platform</p>
        </div>

        {/* Form */}
        <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
          <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Admin Email</label>
              <input
                type='email'
                placeholder='admin@apnacare.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Password</label>
              <input
                type='password'
                placeholder='Enter admin password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all'
                required
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg mt-2 disabled:opacity-70'>
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </button>

          </form>
        </div>

        <p className='text-center text-gray-400 text-xs mt-6'>
          ApnaCare Admin Panel — Authorized Access Only
        </p>
      </div>
    </div>
  )
}

export default Login