import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { token, setToken, userData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>

      {/* Logo */}
      <div onClick={() => navigate('/')} className='cursor-pointer flex items-center gap-2'>
        <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
          <span className='text-white font-bold text-lg'>A</span>
        </div>
        <span className='text-2xl font-bold text-blue-600'>ApnaCare</span>
      </div>

      {/* Desktop Menu */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'><li className='py-1 hover:text-blue-600 transition-colors'>Home</li></NavLink>
        <NavLink to='/doctors'><li className='py-1 hover:text-blue-600 transition-colors'>All Doctors</li></NavLink>
        <NavLink to='/about'><li className='py-1 hover:text-blue-600 transition-colors'>About</li></NavLink>
        <NavLink to='/contact'><li className='py-1 hover:text-blue-600 transition-colors'>Contact</li></NavLink>
        <NavLink to='/symptom-checker'><li className='py-1 hover:text-blue-600 transition-colors'>Symptom Checker</li></NavLink>
      </ul>

      {/* Right Side */}
      <div className='flex items-center gap-4'>
        {
          token
          ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <div className='w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center'>
                <span className='text-blue-600 font-bold'>
                  {userData && userData.name ? userData.name[0].toUpperCase() : 'U'}
                </span>
              </div>
              <img className='w-2.5' src='https://cdn-icons-png.flaticon.com/512/60/60995.png' alt='' />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-white rounded-xl flex flex-col gap-4 p-4 shadow-xl border border-gray-100'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-blue-600 cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-blue-600 cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-red-500 cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
          : <button
              onClick={() => navigate('/login')}
              className='bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md'>
              Login / Signup
            </button>
        }

        {/* Mobile menu */}
        <div onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer'>
          <div className='w-full h-0.5 bg-gray-700 mb-1'></div>
          <div className='w-full h-0.5 bg-gray-700 mb-1'></div>
          <div className='w-full h-0.5 bg-gray-700'></div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300`}>
        <div className='flex items-center justify-between px-5 py-6'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
              <span className='text-white font-bold'>A</span>
            </div>
            <span className='text-xl font-bold text-blue-600'>ApnaCare</span>
          </div>
          <p onClick={() => setShowMenu(false)} className='text-3xl cursor-pointer'>✕</p>
        </div>
        <ul className='flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium'>
          <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded-full hover:bg-blue-50'>Home</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded-full hover:bg-blue-50'>All Doctors</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded-full hover:bg-blue-50'>About</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded-full hover:bg-blue-50'>Contact</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded-full hover:bg-blue-50'>Contact</p></NavLink>
        </ul>
      </div>

    </div>
  )
}

export default Navbar