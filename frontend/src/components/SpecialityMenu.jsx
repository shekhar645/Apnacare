import React from 'react'
import { useNavigate } from 'react-router-dom'

const specialityData = [
  { speciality: 'General physician', icon: '🩺', color: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-700' },
  { speciality: 'Gynecologist', icon: '👩‍⚕️', color: 'from-pink-50 to-pink-100', border: 'border-pink-200', text: 'text-pink-700' },
  { speciality: 'Dermatologist', icon: '🧴', color: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-700' },
  { speciality: 'Pediatricians', icon: '👶', color: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-700' },
  { speciality: 'Neurologist', icon: '🧠', color: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-700' },
  { speciality: 'Gastroenterologist', icon: '💊', color: 'from-teal-50 to-teal-100', border: 'border-teal-200', text: 'text-teal-700' },
]

const SpecialityMenu = () => {
  const navigate = useNavigate()

  return (
    <div className='py-16' id='speciality'>

      {/* Header */}
      <div className='text-center mb-12'>
        <p className='text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2'>What we offer</p>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Find by Speciality</h2>
        <p className='text-gray-500 max-w-xl mx-auto text-base leading-relaxed'>
          Simply browse through our extensive list of trusted doctors and schedule your appointment hassle-free.
        </p>
        <div className='w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full'></div>
      </div>

      {/* Speciality Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
        {specialityData.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/doctors/${item.speciality}`)}
            className={`bg-gradient-to-b ${item.color} border ${item.border} rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 group`}
          >
            <div className='text-4xl group-hover:scale-110 transition-transform duration-300'>
              {item.icon}
            </div>
            <p className={`${item.text} text-center text-sm font-semibold leading-tight`}>
              {item.speciality}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu