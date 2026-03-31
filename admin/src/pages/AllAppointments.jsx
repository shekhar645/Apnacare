import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AllAppointments = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const aToken = localStorage.getItem('aToken')
  const [appointments, setAppointments] = useState([])
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1]) - 1] + ' ' + dateArray[2]
  }

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { atoken: aToken }
      })
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, { headers: { atoken: aToken } })
      if (data.success) { toast.success('Cancelled'); getAllAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/complete-appointment`, { appointmentId }, { headers: { atoken: aToken } })
      if (data.success) { toast.success('Completed ✅'); getAllAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { getAllAppointments() }, [])

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>All Appointments</h1>
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden'>
        <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-2 px-5 py-3 bg-gray-50 border-b'>
          {['#','Patient','Date','Time','Doctor','Fees','Action'].map((h,i) => (
            <p key={i} className='text-xs font-semibold text-gray-500'>{h}</p>
          ))}
        </div>
        {appointments.map((item, index) => (
          <div key={index} className='grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-2 px-5 py-4 border-b hover:bg-gray-50 items-center'>
            <p className='text-gray-400 text-sm'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                <span className='text-blue-600 text-xs font-bold'>{item.userData.name ? item.userData.name[0] : 'U'}</span>
              </div>
              <p className='text-sm font-medium text-gray-700 truncate'>{item.userData.name}</p>
            </div>
            <p className='text-sm text-gray-600'>{slotDateFormat(item.slotDate)}</p>
            <p className='text-sm text-gray-600'>{item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img src={item.docData.image} alt='' className='w-8 h-8 rounded-lg object-cover' />
              <p className='text-sm font-medium text-gray-700 truncate'>{item.docData.name}</p>
            </div>
            <p className='text-sm font-bold text-blue-600'>₹{item.amount}</p>
            <div className='flex items-center gap-1'>
              {item.cancelled
                ? <span className='text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg'>Cancelled</span>
                : item.isCompleted
                ? <span className='text-xs bg-green-100 text-green-600 px-2 py-1 rounded-lg'>Done</span>
                : <>
                    <button onClick={() => completeAppointment(item._id)} className='text-green-600 hover:bg-green-50 p-1.5 rounded-lg text-lg'>✅</button>
                    <button onClick={() => cancelAppointment(item._id)} className='text-red-500 hover:bg-red-50 p-1.5 rounded-lg text-lg'>❌</button>
                  </>
              }
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <div className='text-center py-16 text-gray-400'>
            <span className='text-5xl block mb-3'>📅</span>
            <p>No appointments found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllAppointments