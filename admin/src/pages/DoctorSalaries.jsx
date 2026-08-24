import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorSalaries = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const aToken = localStorage.getItem('aToken')
  const [salaryData, setSalaryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(null)

  const months = ['January','February','March','April','May','June',
    'July','August','September','October','November','December']
  const currentMonth = months[new Date().getMonth()] + ' ' + new Date().getFullYear()

  const getSalaryData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/admin/doctor-salaries`, {
        headers: { atoken: aToken }
      })
      if (data.success) setSalaryData(data.salaryData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const paySalary = async (doctor) => {
    if (doctor.totalAppointments === 0) {
      toast.error('No completed appointments to pay salary for!')
      return
    }
    const alreadyPaid = doctor.salaryHistory.find(s => s.month === currentMonth)
    if (alreadyPaid) {
      toast.error(`Salary for ${currentMonth} already paid!`)
      return
    }
    try {
      setPaying(doctor._id)
      const { data } = await axios.post(`${backendUrl}/api/admin/pay-salary`, {
        docId: doctor._id,
        amount: doctor.doctorSalary,
        month: currentMonth,
        appointments: doctor.totalAppointments
      }, { headers: { atoken: aToken } })
      if (data.success) {
        toast.success(data.message)
        getSalaryData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setPaying(null)
    }
  }

  useEffect(() => { getSalaryData() }, [])

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
    </div>
  )

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-2'>Doctor Salary Management</h1>
      <p className='text-gray-500 text-sm mb-6'>Current Month: <span className='font-semibold text-blue-600'>{currentMonth}</span></p>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>👨‍⚕️</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{salaryData.length}</p>
              <p className='text-gray-500 text-sm'>Total Doctors</p>
            </div>
          </div>
        </div>
        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>💰</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>
                ₹{salaryData.reduce((sum, d) => sum + d.doctorSalary, 0).toLocaleString()}
              </p>
              <p className='text-gray-500 text-sm'>Total Salaries to Pay</p>
            </div>
          </div>
        </div>
        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>🏦</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>
                ₹{salaryData.reduce((sum, d) => sum + d.adminShare, 0).toLocaleString()}
              </p>
              <p className='text-gray-500 text-sm'>Admin Revenue (20%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className='bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6'>
        <p className='text-blue-700 text-sm'>💡 <strong>Salary Formula:</strong> Doctor gets <strong>80%</strong> of total appointment fees. Admin keeps <strong>20%</strong> as platform fee.</p>
      </div>

      {/* Doctor Salary Table */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden'>
        <div className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-5 py-3 bg-gray-50 border-b'>
          {['Doctor', 'Speciality', 'Appointments', 'Total Earned', 'Salary (80%)', 'Action'].map((h, i) => (
            <p key={i} className='text-xs font-semibold text-gray-500'>{h}</p>
          ))}
        </div>

        {salaryData.map((doctor, index) => {
          const alreadyPaid = doctor.salaryHistory.find(s => s.month === currentMonth)
          return (
            <div key={index} className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-5 py-4 border-b hover:bg-gray-50 items-center'>
              <div className='flex items-center gap-3'>
                <img src={doctor.image} alt={doctor.name} className='w-10 h-10 rounded-xl object-cover' />
                <div>
                  <p className='font-semibold text-gray-800 text-sm'>{doctor.name}</p>
                  <p className='text-gray-400 text-xs'>₹{doctor.fees} / visit</p>
                </div>
              </div>
              <p className='text-sm text-blue-600 font-medium'>{doctor.speciality}</p>
              <p className='text-sm text-gray-700 font-bold'>{doctor.totalAppointments}</p>
              <p className='text-sm text-gray-700'>₹{doctor.totalEarned.toLocaleString()}</p>
              <p className='text-sm font-bold text-green-600'>₹{doctor.doctorSalary.toLocaleString()}</p>
              <div>
                {alreadyPaid ? (
                  <span className='text-xs bg-green-100 text-green-600 px-3 py-1.5 rounded-lg font-semibold'>✅ Paid</span>
                ) : (
                  <button
                    onClick={() => paySalary(doctor)}
                    disabled={paying === doctor._id || doctor.totalAppointments === 0}
                    className='text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {paying === doctor._id ? 'Paying...' : 'Pay Salary'}
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {salaryData.length === 0 && (
          <div className='text-center py-16 text-gray-400'>
            <span className='text-5xl block mb-3'>💰</span>
            <p>No salary data found</p>
          </div>
        )}
      </div>

      {/* Salary History */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Salary Payment History</h2>
        <div className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden'>
          <div className='grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-5 py-3 bg-gray-50 border-b'>
            {['Doctor', 'Month', 'Amount Paid', 'Appointments'].map((h, i) => (
              <p key={i} className='text-xs font-semibold text-gray-500'>{h}</p>
            ))}
          </div>
          {salaryData.flatMap(doctor =>
            doctor.salaryHistory.map((history, i) => (
              <div key={`${doctor._id}-${i}`} className='grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-5 py-4 border-b hover:bg-gray-50 items-center'>
                <div className='flex items-center gap-3'>
                  <img src={doctor.image} alt={doctor.name} className='w-8 h-8 rounded-lg object-cover' />
                  <p className='font-medium text-gray-800 text-sm'>{doctor.name}</p>
                </div>
                <p className='text-sm text-gray-600'>{history.month}</p>
                <p className='text-sm font-bold text-green-600'>₹{history.amount.toLocaleString()}</p>
                <p className='text-sm text-gray-600'>{history.appointments} appointments</p>
              </div>
            ))
          )}
          {salaryData.every(d => d.salaryHistory.length === 0) && (
            <div className='text-center py-10 text-gray-400'>
              <span className='text-4xl block mb-2'>📋</span>
              <p>No payment history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorSalaries