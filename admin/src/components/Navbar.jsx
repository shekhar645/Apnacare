import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ aToken, setAToken }) => {
  const navigate = useNavigate()

  const logout = () => {
    setAToken('')
    localStorage.removeItem('aToken')
    navigate('/')
  }

  return (
    <div className='flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm'>
      <div className='flex items-center gap-2'>
        <div className='w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center'>
          <span className='text-white font-bold'>A</span>
        </div>
        <span className='text-xl font-bold text-blue-600'>ApnaCare</span>
        <span className='text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium ml-1'>Admin</span>
      </div>
      <button
        onClick={logout}
        className='bg-red-50 text-red-600 px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors border border-red-200'>
        Logout
      </button>
    </div>
  )
}

export default Navbar