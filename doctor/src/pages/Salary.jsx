import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Salary = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const dToken = localStorage.getItem('dToken')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1]) - 1] + ' ' + dateArray[2]
  }

  const getData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointments`, {},
        { headers: { dtoken: dToken } }
      )
      if (data.success) setAppointments(data.appointments)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { getData() }, [])

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
    </div>
  )

  const completedAppointments = appointments.filter(a => a.isCompleted)
  const totalEarned = completedAppointments.reduce((sum, a) => sum + a.amount, 0)
  const thisMonth = new Date().getMonth() + 1
  const thisYear = new Date().getFullYear()
  const monthlyEarned = completedAppointments
    .filter(a => {
      const parts = a.slotDate.split('_')
      return Number(parts[1]) === thisMonth && Number(parts[2]) === thisYear
    })
    .reduce((sum, a) => sum + a.amount, 0)

  return (
    <div>
      <h2 className='text-xl font-bold text-gray-800 mb-6'>My Salary & Earnings</h2>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
        {[
          { icon: '💰', label: 'Total Earned', value: `₹${totalEarned.toLocaleString()}`, color: 'bg-green-100', text: 'text-green-600' },
          { icon: '📅', label: 'This Month', value: `₹${monthlyEarned.toLocaleString()}`, color: 'bg-blue-100', text: 'text-blue-600' },
          { icon: '✅', label: 'Completed', value: completedAppointments.length, color: 'bg-purple-100', text: 'text-purple-600' },
        ].map((item, i) => (
          <div key={i} className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
            <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
              <span className='text-2xl'>{item.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${item.text}`}>{item.value}</p>
            <p className='text-gray-500 text-sm mt-1'>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Earnings Table */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden'>
        <div className='px-5 py-4 border-b border-gray-100'>
          <h3 className='font-bold text-gray-800'>Completed Appointments</h3>
          <p className='text-gray-400 text-xs mt-1'>Only completed appointments count toward earnings</p>
        </div>

        <div className='grid grid-cols-[40px_1fr_1fr_1fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase'>
          <span>#</span>
          <span>Patient</span>
          <span>Date</span>
          <span>Amount</span>
        </div>

        {completedAppointments.length === 0 ? (
          <div className='text-center py-12 text-gray-400'>
            <span className='text-5xl block mb-3'>💸</span>
            <p>No completed appointments yet</p>
          </div>
        ) : (
          completedAppointments.reverse().map((item, index) => (
            <div
              key={index}
              className='grid grid-cols-[40px_1fr_1fr_1fr] gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 items-center'
            >
              <span className='text-gray-400 text-sm'>{index + 1}</span>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                  <span className='text-green-600 font-bold text-sm'>{item.userData.name[0]}</span>
                </div>
                <p className='text-sm font-medium text-gray-800'>{item.userData.name}</p>
              </div>
              <p className='text-sm text-gray-500'>{slotDateFormat(item.slotDate)}</p>
              <p className='text-sm font-bold text-green-600'>₹{item.amount}</p>
            </div>
          ))
        )}

        {completedAppointments.length > 0 && (
          <div className='px-5 py-4 bg-green-50 flex justify-between items-center'>
            <p className='font-semibold text-gray-700'>Total Earnings</p>
            <p className='text-xl font-bold text-green-600'>₹{totalEarned.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Salary