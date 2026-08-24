import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Salary from './pages/Salary'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

const App = () => {
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')

  return dToken
    ? <div className='bg-gray-50 min-h-screen'>
        <ToastContainer />
        <Navbar dToken={dToken} setDToken={setDToken} />
        <div className='flex'>
          <Sidebar />
          <div className='flex-1 p-6'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/appointments' element={<Appointments />} />
              <Route path='/salary' element={<Salary />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    : <Login setDToken={setDToken} />
}

export default App