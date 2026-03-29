import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const Dashboard = () => {
  const backendUrl = 'http://localhost:5000'
  const aToken = localStorage.getItem('aToken')
  const [dashData, setDashData] = useState({
    doctors: 0, appointments: 0, patients: 0, latestAppointments: []
  })

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1]) - 1] + ' ' + dateArray[2]
  }

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { atoken: aToken }
      })
      if (data.success) setDashData(data.dashData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => { getDashData() }, [])

  // Chart Data
  const barData = [
    { name: 'Doctors', value: dashData.doctors, fill: '#3b82f6' },
    { name: 'Appointments', value: dashData.appointments, fill: '#10b981' },
    { name: 'Patients', value: dashData.patients, fill: '#8b5cf6' },
  ]

  const completed = dashData.latestAppointments.filter(a => a.isCompleted).length
  const cancelled = dashData.latestAppointments.filter(a => a.cancelled).length
  const upcoming = dashData.latestAppointments.filter(a => !a.isCompleted && !a.cancelled).length

  const pieData = [
    { name: 'Completed', value: completed || 0 },
    { name: 'Upcoming', value: upcoming || 0 },
    { name: 'Cancelled', value: cancelled || 0 },
  ]
  const COLORS = ['#10b981', '#3b82f6', '#ef4444']

  const specialityData = [
    { name: 'General', value: 3 },
    { name: 'Gynecologist', value: 2 },
    { name: 'Dermatologist', value: 2 },
    { name: 'Neurologist', value: 2 },
    { name: 'Pediatric', value: 2 },
    { name: 'Gastro', value: 2 },
  ]

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Dashboard</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8'>
        {[
          { icon: '👨‍⚕️', count: dashData.doctors, label: 'Total Doctors', color: 'bg-blue-100' },
          { icon: '📅', count: dashData.appointments, label: 'Total Appointments', color: 'bg-green-100' },
          { icon: '👥', count: dashData.patients, label: 'Total Patients', color: 'bg-purple-100' }
        ].map((item, i) => (
          <div key={i} className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                <span className='text-2xl'>{item.icon}</span>
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-800'>{item.count}</p>
                <p className='text-gray-500 text-sm'>{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-8'>

        {/* Bar Chart */}
        <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5'>
          <h2 className='font-bold text-gray-800 mb-4'>📊 Overview</h2>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis dataKey='name' tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey='value' radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5'>
          <h2 className='font-bold text-gray-800 mb-4'>🥧 Appointment Status</h2>
          <ResponsiveContainer width='100%' height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey='value'
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Doctors by Speciality Bar Chart */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-8'>
        <h2 className='font-bold text-gray-800 mb-4'>👨‍⚕️ Doctors by Speciality</h2>
        <ResponsiveContainer width='100%' height={220}>
          <BarChart data={specialityData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis dataKey='name' tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Bar dataKey='value' fill='#3b82f6' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Latest Appointments */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm'>
        <div className='p-5 border-b border-gray-100'>
          <h2 className='font-bold text-gray-800'>Latest Appointments</h2>
        </div>
        <div className='p-3'>
          {dashData.latestAppointments.map((item, index) => (
            <div key={index} className='flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl'>
              <img src={item.docData.image} alt='' className='w-10 h-10 rounded-xl object-cover' />
              <div className='flex-1'>
                <p className='font-medium text-gray-800 text-sm'>{item.docData.name}</p>
                <p className='text-gray-400 text-xs'>{slotDateFormat(item.slotDate)} — {item.slotTime}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${item.cancelled ? 'bg-red-100 text-red-600' : item.isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Upcoming'}
              </div>
            </div>
          ))}
          {dashData.latestAppointments.length === 0 && (
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
