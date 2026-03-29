import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AllAppointments from './pages/AllAppointments'
import AddDoctor from './pages/AddDoctor'
import DoctorsList from './pages/DoctorsList'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

const App = () => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '')

  return aToken
    ? <div className='bg-gray-50 min-h-screen'>
        <ToastContainer />
        <Navbar aToken={aToken} setAToken={setAToken} />
        <div className='flex'>
          <Sidebar />
          <div className='flex-1 p-6'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllAppointments />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/doctors-list' element={<DoctorsList />} />
            </Routes>
          </div>
        </div>
      </div>
    : <Login setAToken={setAToken} />
}

export default App