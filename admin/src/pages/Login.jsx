import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import logo from '../assets/logo.jpeg'

const Login = ({ setDToken }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password })
      if (data.success) {
        localStorage.setItem('dToken', data.token)
        setDToken(data.token)
        toast.success('Welcome Doctor! 👨‍⚕️')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center'>
      <div className='bg-white rounded-3xl shadow-xl p-8 w-full max-w-md'>
        <div className='text-center mb-8'>
          <img
            src={logo}
            alt='ApnaCare Logo'
            className='w-16 h-16 rounded-2xl object-cover mx-auto mb-4'
          />
          <h1 className='text-2xl font-bold text-gray-800'>ApnaCare</h1>
          <p className='text-gray-500 text-sm mt-1'>Doctor Portal Login</p>
        </div>

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='doctor@example.com'
              required
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              required
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login