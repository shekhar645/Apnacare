import React from 'react'
import logo from '../assets/logo.jpeg'

const Navbar = ({ dToken, setDToken }) => {
  const logout = () => {
    localStorage.removeItem('dToken')
    setDToken('')
  }

  return (
    <div className='flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm'>
      <div className='flex items-center gap-3'>
        <img src={logo} alt='ApnaCare' className='w-9 h-9 object-contain rounded-xl' />
        <div>
          <p className='font-bold text-gray-800 text-lg'>ApnaCare</p>
          <p className='text-xs text-blue-600 font-medium'>Doctor Portal</p>
        </div>
      </div>
      <button
        onClick={logout}
        className='bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar