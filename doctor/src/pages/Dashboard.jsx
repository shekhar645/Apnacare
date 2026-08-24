import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const dToken = localStorage.getItem('dToken')
  const [appointments, setAppointments] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1]) - 1] + ' ' + dateArray[2]
  }

  const getData = async () => {
    try {
      setLoading(true)
      const [apptRes, profileRes] = await Promise.all([
        axios.post(`${backendUrl}/api/doctor/appointments`, {}, { headers: { dtoken: dToken } }),
        axios.post(`${backendUrl}/api/doctor/profile`, {}, { headers: { dtoken: dToken } })
      ])
      if (apptRes.data.success) setAppointments(apptRes.data.appointments)
      if (profileRes.data.success) setProfile(profileRes.data.doctor)
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

  const completed = appointments.filter(a => a.isCompleted).length
  const cancelled = appointments.filter(a => a.cancelled).length
  const upcoming = appointments.filter(a => !a.isCompleted && !a.cancelled).length
  const totalEarned = appointments.filter(a => a.isCompleted).reduce((sum, a) => sum + a.amount, 0)

  return (
    <div>
      {/* Welcome Banner */}
      {profile && (
        <div className='bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 mb-6 text-white flex items-center gap-4'>
          <img src={profile.image} alt={profile.name} className='w-16 h-16 rounded-2xl object-cover border-2 border-white' />
          <div>
            <p className='text-blue-100 text-sm'>Welcome back,</p>
            <h1 className='text-2xl font-bold'>{profile.name}</h1>
            <p className='text-blue-100 text-sm'>{profile.speciality} • {profile.experience} experience</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
        {[
          { icon: '📅', count: appointments.length, label: 'Total Appointments', color: 'bg-blue-100' },
          { icon: '✅', count: completed, label: 'Completed', color: 'bg-green-100' },
          { icon: '⏳', count: upcoming, label: 'Upcoming', color: 'bg-yellow-100' },
          { icon: '💰', count: `₹${totalEarned.toLocaleString()}`, label: 'Total Earned', color: 'bg-purple-100' },
        ].map((item, i) => (
          <div key={i} className='bg-white border border-gray-100 rounded-2xl p-4 shadow-sm'>
            <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
              <span className='text-xl'>{item.icon}</span>
            </div>
            <p className='text-xl font-bold text-gray-800'>{item.count}</p>
            <p className='text-gray-500 text-xs'>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm'>
        <div className='p-5 border-b border-gray-100'>
          <h2 className='font-bold text-gray-800'>Latest Appointments</h2>
        </div>
        <div className='p-3'>
          {appointments.slice(0, 5).reverse().map((item, index) => (
            <div key={index} className='flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl'>
              <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                <span className='text-blue-600 font-bold'>{item.userData.name[0]}</span>
              </div>
              <div className='flex-1'>
                <p className='font-medium text-gray-800 text-sm'>{item.userData.name}</p>
                <p className='text-gray-400 text-xs'>{slotDateFormat(item.slotDate)} — {item.slotTime}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                item.cancelled ? 'bg-red-100 text-red-600' :
                item.isCompleted ? 'bg-green-100 text-green-600' :
                'bg-blue-100 text-blue-600'}`}>
                {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Upcoming'}
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className='text-center py-8 text-gray-400'>
              <span className='text-4xl block mb-2'>📅</span>
              <p>No appointments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard