import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <div className='py-16'>
      <div className='text-center mb-12'>
        <p className='text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2'>Our Experts</p>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Top Doctors</h2>
        <p className='text-gray-500 max-w-xl mx-auto text-base leading-relaxed'>Simply browse through our extensive list of trusted doctors.</p>
        <div className='w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full'></div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {doctors.slice(0, 6).map((doctor, index) => (
          <div key={index} onClick={() => navigate(`/appointment/${doctor._id}`)}
            className='bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1'>
            <div className='bg-gradient-to-br from-blue-50 to-blue-100 h-48 flex items-center justify-center relative'>
              <img src={doctor.image} alt={doctor.name} className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-300' />
              <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${doctor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {doctor.available ? 'Available' : 'Busy'}
              </div>
            </div>
            <div className='p-5'>
              <h3 className='font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors'>{doctor.name}</h3>
              <p className='text-blue-600 text-sm font-medium mb-1'>{doctor.speciality}</p>
              <p className='text-gray-400 text-xs mb-3'>📍 {doctor.address.line1}, {doctor.address.line2}</p>
              <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                <div className='flex items-center gap-1'>
                  <span>⭐</span>
                  <span className='font-medium text-gray-700'>4.8</span>
                  <span>(120)</span>
                </div>
                <span>{doctor.experience} exp</span>
              </div>
              <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                <div>
                  <p className='text-xs text-gray-400'>Consultation</p>
                  <p className='text-blue-600 font-bold text-lg'>₹{doctor.fees}</p>
                </div>
                <button className='bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors'>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='text-center mt-10'>
        <button onClick={() => navigate('/doctors')}
          className='border-2 border-blue-600 text-blue-600 px-10 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300'>
          View All Doctors →
        </button>
      </div>
    </div>
  )
}

export default TopDoctors