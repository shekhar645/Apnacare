import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorsList = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const aToken = localStorage.getItem('aToken')
  const [doctors, setDoctors] = useState([])

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { atoken: aToken }
      })
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, { headers: { atoken: aToken } })
      if (data.success) { toast.success('Updated ✅'); getAllDoctors() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { getAllDoctors() }, [])

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Doctors List</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {doctors.map((doctor, index) => (
          <div key={index} className='bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all'>
            <div className='bg-gradient-to-br from-blue-50 to-blue-100 h-40 flex items-center justify-center'>
              <img src={doctor.image} alt={doctor.name} className='h-full w-full object-cover' />
            </div>
            <div className='p-4'>
              <h3 className='font-bold text-gray-800 mb-1'>{doctor.name}</h3>
              <p className='text-blue-600 text-sm font-medium mb-1'>{doctor.speciality}</p>
              <p className='text-gray-400 text-xs mb-3'>📍 {doctor.address.line1}, {doctor.address.line2}</p>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div onClick={() => changeAvailability(doctor._id)}
                    className={`w-10 h-5 rounded-full cursor-pointer transition-all relative ${doctor.available ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${doctor.available ? 'left-5' : 'left-0.5'}`}></div>
                  </div>
                  <span className={`text-xs font-medium ${doctor.available ? 'text-green-600' : 'text-gray-400'}`}>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <span className='text-blue-600 font-bold text-sm'>₹{doctor.fees}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {doctors.length === 0 && (
        <div className='text-center py-16 text-gray-400'>
          <span className='text-5xl block mb-3'>👨‍⚕️</span>
          <p>No doctors found</p>
        </div>
      )}
    </div>
  )
}

export default DoctorsList