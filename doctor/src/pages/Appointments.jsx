import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Appointments = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const dToken = localStorage.getItem('dToken')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1]) - 1] + ' ' + dateArray[2]
  }

  const getAppointments = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointments`, {},
        { headers: { dtoken: dToken } }
      )
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      )
      if (data.success) { toast.success('Marked as completed!'); getAppointments() }
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      )
      if (data.success) { toast.success('Appointment cancelled'); getAppointments() }
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const goToPrescription = (appointmentId, patientId) => {
    navigate(`/prescriptions?appointmentId=${appointmentId}&patientId=${patientId}`)
  }

  const joinVideoCall = (appointmentId) => {
    window.location.href = `https://meet.jit.si/ApnaCare-${appointmentId}`
  }

  useEffect(() => { getAppointments() }, [])

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
    </div>
  )

  return (
    <div>
      <h2 className='text-xl font-bold text-gray-800 mb-6'>My Appointments</h2>

      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden'>
        <div className='grid grid-cols-[40px_1fr_1fr_1fr_2fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase'>
          <span>#</span>
          <span>Patient</span>
          <span>Date & Time</span>
          <span>Fees</span>
          <span>Action</span>
        </div>

        {appointments.length === 0 ? (
          <div className='text-center py-12 text-gray-400'>
            <span className='text-5xl block mb-3'>📅</span>
            <p>No appointments found</p>
          </div>
        ) : (
          appointments.map((item, index) => (
            <div
              key={index}
              className='grid grid-cols-[40px_1fr_1fr_1fr_2fr] gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 items-center'
            >
              <span className='text-gray-400 text-sm'>{index + 1}</span>

              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <span className='text-blue-600 font-bold text-sm'>{item.userData.name[0]}</span>
                </div>
                <div>
                  <p className='font-medium text-gray-800 text-sm'>{item.userData.name}</p>
                  <p className='text-gray-400 text-xs'>{item.userData.email}</p>
                </div>
              </div>

              <div>
                <p className='text-sm text-gray-700 font-medium'>{slotDateFormat(item.slotDate)}</p>
                <p className='text-xs text-gray-400'>{item.slotTime}</p>
              </div>

              <p className='text-sm font-semibold text-gray-800'>₹{item.amount}</p>

              {item.cancelled ? (
                <span className='text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full w-fit'>
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <div className='flex gap-2 flex-wrap'>
                  <button
                    onClick={() => goToPrescription(item._id, item.userId)}
                    className='text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-all w-fit'
                  >
                    💊 Prescribe
                  </button>
                </div>
              ) : (
                <div className='flex gap-2 flex-wrap'>
                  <button
                    onClick={() => joinVideoCall(item._id)}
                    className='text-xs bg-purple-500 text-white px-3 py-1.5 rounded-lg hover:bg-purple-600 transition-all'
                  >
                    🎥 Video Call
                  </button>
                  <button
                    onClick={() => completeAppointment(item._id)}
                    className='text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-all'
                  >
                    ✓ Done
                  </button>
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all'
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Appointments