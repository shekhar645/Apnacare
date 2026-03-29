import React from 'react'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col md:flex-row bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl px-8 md:px-14 lg:px-20 py-12 my-6 shadow-xl overflow-hidden relative'>

      {/* Left side */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-5 z-10'>

        <div className='bg-blue-500 bg-opacity-40 px-4 py-1.5 rounded-full'>
          <p className='text-blue-100 text-sm font-medium'>🏥 Trusted by 10,000+ patients</p>
        </div>

        <h1 className='text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight'>
          Your Health, <br/>
          <span className='text-blue-200'>Our Priority</span>
        </h1>

        <p className='text-blue-100 text-base md:text-lg leading-relaxed'>
          Book appointments with the best doctors near you. Quick, easy and reliable healthcare at your fingertips.
        </p>

        <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
          <button
            onClick={() => navigate('/doctors')}
            className='bg-white text-blue-600 px-8 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-base'>
            Book Appointment →
          </button>
          <button
            onClick={() => navigate('/about')}
            className='border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all text-base'>
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className='flex gap-8 mt-4'>
          <div>
            <p className='text-white text-2xl font-bold'>500+</p>
            <p className='text-blue-200 text-sm'>Doctors</p>
          </div>
          <div className='border-l border-blue-400 pl-8'>
            <p className='text-white text-2xl font-bold'>50+</p>
            <p className='text-blue-200 text-sm'>Specialities</p>
          </div>
          <div className='border-l border-blue-400 pl-8'>
            <p className='text-white text-2xl font-bold'>10k+</p>
            <p className='text-blue-200 text-sm'>Happy Patients</p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className='md:w-1/2 flex justify-center items-center mt-10 md:mt-0'>
        <div className='relative'>
          <div className='w-64 h-64 md:w-80 md:h-80 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center'>
            <div className='w-52 h-52 md:w-64 md:h-64 bg-blue-400 bg-opacity-40 rounded-full flex items-center justify-center'>
              <span className='text-8xl md:text-9xl'>👨‍⚕️</span>
            </div>
          </div>
          {/* Floating cards */}
          <div className='absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-lg'>
            <p className='text-blue-600 font-bold text-sm'>✓ Verified Doctors</p>
          </div>
          <div className='absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-lg'>
            <p className='text-green-600 font-bold text-sm'>🟢 Available Now</p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className='absolute top-0 right-0 w-64 h-64 bg-blue-500 bg-opacity-20 rounded-full -translate-y-1/2 translate-x-1/2'></div>
      <div className='absolute bottom-0 left-0 w-48 h-48 bg-blue-400 bg-opacity-20 rounded-full translate-y-1/2 -translate-x-1/2'></div>

    </div>
  )
}

export default Banner