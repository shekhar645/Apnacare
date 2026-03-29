import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1]) - 1] + ' ' + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/appointments`, {}, {
        headers: { token }
      })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success('Appointment cancelled')
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) getUserAppointments()
  }, [token])

  return (
    <div className='py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Appointments</h1>
        <p className='text-gray-500'>Manage all your upcoming and past appointments</p>
      </div>

      {appointments.length === 0
        ? <div className='flex flex-col items-center justify-center py-20 text-center'>
            <span className='text-6xl mb-4'>📅</span>
            <h3 className='text-xl font-bold text-gray-700 mb-2'>No appointments yet</h3>
            <p className='text-gray-400 mb-6'>Book your first appointment with our trusted doctors</p>
            <button
              onClick={() => navigate('/doctors')}
              className='bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors'>
              Find a Doctor
            </button>
          </div>
        : <div className='flex flex-col gap-4'>
            {appointments.map((item, index) => (
              <div key={index} className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all'>
                <div className='flex flex-col md:flex-row gap-5'>

                  {/* Doctor Image */}
                  <div className='w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-blue-50 flex-shrink-0'>
                    <img src={item.docData.image} alt={item.docData.name} className='w-full h-full object-cover' />
                  </div>

                  {/* Appointment Info */}
                  <div className='flex-1'>
                    <div className='flex items-start justify-between mb-2'>
                      <div>
                        <h3 className='font-bold text-gray-800 text-lg'>{item.docData.name}</h3>
                        <p className='text-blue-600 text-sm font-medium'>{item.docData.speciality}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.cancelled
                          ? 'bg-red-100 text-red-600'
                          : item.isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Upcoming'}
                      </div>
                    </div>

                    <div className='flex flex-wrap gap-4 text-sm text-gray-500 mb-3'>
                      <div className='flex items-center gap-1.5'>
                        <span>📅</span>
                        <span>{slotDateFormat(item.slotDate)}</span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <span>🕐</span>
                        <span>{item.slotTime}</span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <span>📍</span>
                        <span>{item.docData.address.line1}, {item.docData.address.line2}</span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-1.5'>
                        <span>💰</span>
                        <span className='font-bold text-blue-600'>₹{item.amount}</span>
                      </div>
                      {!item.cancelled && !item.isCompleted && (
                        <div className='flex gap-3'>
                          <button
                            onClick={() => navigate(`/appointment/${item.docId}`)}
                            className='px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors'>
                            Reschedule
                          </button>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className='px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors border border-red-200'>
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

export default MyAppointments