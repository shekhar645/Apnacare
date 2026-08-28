import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Payments = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const aToken = localStorage.getItem('aToken')
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')

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

  useEffect(() => { getAllAppointments() }, [])

  // Only count money from non-cancelled bookings (real revenue)
  const paidAppointments = appointments.filter(a => !a.cancelled)

  const totalRevenue = paidAppointments.reduce((sum, a) => sum + Number(a.amount || 0), 0)
  const completedRevenue = paidAppointments.filter(a => a.isCompleted).reduce((sum, a) => sum + Number(a.amount || 0), 0)
  const pendingRevenue = paidAppointments.filter(a => !a.isCompleted).reduce((sum, a) => sum + Number(a.amount || 0), 0)
  const cancelledCount = appointments.filter(a => a.cancelled).length

  // Group revenue by doctor (useful for salary decisions)
  const doctorEarnings = {}
  paidAppointments.forEach(a => {
    const docName = a.docData.name
    if (!doctorEarnings[docName]) {
      doctorEarnings[docName] = { name: docName, image: a.docData.image, total: 0, count: 0 }
    }
    doctorEarnings[docName].total += Number(a.amount || 0)
    doctorEarnings[docName].count += 1
  })
  const doctorEarningsList = Object.values(doctorEarnings).sort((a, b) => b.total - a.total)

  const filteredAppointments = appointments.filter(a => {
    if (filter === 'completed') return a.isCompleted
    if (filter === 'upcoming') return !a.isCompleted && !a.cancelled
    if (filter === 'cancelled') return a.cancelled
    return true
  })

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Payments</h1>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>💰</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>₹{totalRevenue}</p>
              <p className='text-gray-500 text-sm'>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>✅</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>₹{completedRevenue}</p>
              <p className='text-gray-500 text-sm'>From Completed</p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>⏳</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>₹{pendingRevenue}</p>
              <p className='text-gray-500 text-sm'>From Upcoming</p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>❌</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{cancelledCount}</p>
              <p className='text-gray-500 text-sm'>Cancelled Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings by Doctor - useful for deciding salaries */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm mb-8'>
        <div className='p-5 border-b border-gray-100'>
          <h2 className='font-bold text-gray-800'>Earnings by Doctor</h2>
          <p className='text-gray-400 text-xs mt-1'>Revenue generated per doctor from patient bookings</p>
        </div>
        <div className='p-3'>
          {doctorEarningsList.length === 0 ? (
            <div className='text-center py-8 text-gray-400'>
              <p>No earnings data yet</p>
            </div>
          ) : (
            doctorEarningsList.map((doc, index) => (
              <div key={index} className='flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl'>
                <img src={doc.image} alt='' className='w-10 h-10 rounded-xl object-cover' />
                <div className='flex-1'>
                  <p className='font-medium text-gray-800 text-sm'>{doc.name}</p>
                  <p className='text-gray-400 text-xs'>{doc.count} appointment{doc.count !== 1 ? 's' : ''}</p>
                </div>
                <p className='font-bold text-blue-600'>₹{doc.total}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm'>
        <div className='p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3'>
          <h2 className='font-bold text-gray-800'>All Transactions</h2>
          <div className='flex gap-2'>
            {['all', 'completed', 'upcoming', 'cancelled'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr_1fr] gap-2 px-5 py-3 bg-gray-50 border-b'>
          {['#','Patient','Doctor','Date','Amount','Status'].map((h,i) => (
            <p key={i} className='text-xs font-semibold text-gray-500'>{h}</p>
          ))}
        </div>

        {filteredAppointments.map((item, index) => (
          <div key={index} className='grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr_1fr] gap-2 px-5 py-4 border-b hover:bg-gray-50 items-center'>
            <p className='text-gray-400 text-sm'>{index + 1}</p>
            <p className='text-sm font-medium text-gray-700 truncate'>{item.userData.name}</p>
            <p className='text-sm font-medium text-gray-700 truncate'>{item.docData.name}</p>
            <p className='text-sm text-gray-600'>{slotDateFormat(item.slotDate)}</p>
            <p className='text-sm font-bold text-blue-600'>₹{item.amount}</p>
            <div>
              {item.cancelled
                ? <span className='text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg'>Cancelled</span>
                : item.isCompleted
                ? <span className='text-xs bg-green-100 text-green-600 px-2 py-1 rounded-lg'>Completed</span>
                : <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg'>Upcoming</span>
              }
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className='text-center py-16 text-gray-400'>
            <span className='text-5xl block mb-3'>💳</span>
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payments