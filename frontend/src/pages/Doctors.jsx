import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  useEffect(() => {
    setLoading(true)
    let filtered = doctors
    if (speciality) {
      filtered = filtered.filter(doc => doc.speciality === speciality)
    }
    if (search.trim()) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(search.toLowerCase())
      )
    }
    setFilterDoc(filtered)
    setLoading(false)
  }, [doctors, speciality, search])

  return (
    <div className='py-8'>

      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Find Your Doctor</h1>
        <p className='text-gray-500'>Browse through our extensive list of trusted doctors</p>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <div className='flex items-center gap-3 bg-white border-2 border-blue-200 rounded-2xl px-5 py-3 shadow-sm focus-within:border-blue-500 transition-all'>
          <span className='text-xl'>🔍</span>
          <input
            type='text'
            placeholder='Search by doctor name or speciality...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1 outline-none text-gray-700 text-base bg-transparent'
          />
          {search && (
            <button onClick={() => setSearch('')} className='text-gray-400 hover:text-gray-600 text-xl'>✕</button>
          )}
        </div>
        {search && (
          <p className='text-sm text-gray-500 mt-2 ml-2'>
            Found <span className='font-bold text-blue-600'>{filterDoc.length}</span> doctor(s) for "{search}"
          </p>
        )}
      </div>

      <div className='flex flex-col md:flex-row gap-6'>

        {/* Filter Sidebar */}
        <div className='md:w-64 flex-shrink-0'>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className='md:hidden w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium mb-4'>
            {showFilter ? 'Hide Filters ✕' : 'Show Filters ☰'}
          </button>

          <div className={`${showFilter ? 'block' : 'hidden'} md:block`}>
            <div className='bg-white rounded-2xl border border-gray-100 p-5 shadow-sm'>
              <h3 className='font-bold text-gray-800 mb-4 text-base'>Speciality</h3>
              <div className='flex flex-col gap-2'>
                {specialities.map((spec, index) => (
                  <div
                    key={index}
                    onClick={() => speciality === spec
                      ? navigate('/doctors')
                      : navigate(`/doctors/${spec}`)}
                    className={`px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all ${
                      speciality === spec
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}>
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 mt-4 text-white'>
              <h3 className='font-bold mb-2'>Need Help?</h3>
              <p className='text-blue-100 text-sm mb-3'>Not sure which specialist to see?</p>
              <button
                onClick={() => navigate('/symptom-checker')}
                className='bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold w-full hover:bg-blue-50 transition-colors'>
                Try Symptom Checker
              </button>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className='flex-1'>
          {loading
            ? <div className='flex justify-center items-center py-20'>
                <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
              </div>
            : filterDoc.length === 0
              ? <div className='flex flex-col items-center justify-center py-20 text-center'>
                  <span className='text-6xl mb-4'>👨‍⚕️</span>
                  <h3 className='text-xl font-bold text-gray-700 mb-2'>No doctors found</h3>
                  <p className='text-gray-400 mb-4'>Try a different search or speciality</p>
                  <button
                    onClick={() => { navigate('/doctors'); setSearch('') }}
                    className='bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium'>
                    View All Doctors
                  </button>
                </div>
              : <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                  {filterDoc.map((doctor, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(`/appointment/${doctor._id}`)}
                      className='bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1'>

                      <div className='bg-gradient-to-br from-blue-50 to-blue-100 h-48 flex items-center justify-center relative'>
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-300'
                        />
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
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors