import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/appointments', icon: '📅', label: 'My Appointments' },
    { path: '/prescriptions', icon: '💊', label: 'Prescriptions' },
    { path: '/salary', icon: '💰', label: 'My Salary' },
    { path: '/profile', icon: '👨‍⚕️', label: 'My Profile' },
  ]

  return (
    <div className='w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm'>
      <div className='p-4'>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 font-medium text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`
            }>
            <span className='text-xl'>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar