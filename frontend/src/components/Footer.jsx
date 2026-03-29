import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <div className='mt-20'>

      {/* CTA Banner */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 mb-16 text-center'>
        <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>Ready to take control of your health?</h2>
        <p className='text-blue-100 mb-8 text-lg'>Join thousands of patients who trust ApnaCare for their healthcare needs.</p>
        <button
          onClick={() => navigate('/login')}
          className='bg-white text-blue-600 px-10 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg text-base'>
          Get Started Today →
        </button>
      </div>

      {/* Main Footer */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-200'>

        {/* Brand */}
        <div className='col-span-1 md:col-span-1'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>A</span>
            </div>
            <span className='text-2xl font-bold text-blue-600'>ApnaCare</span>
          </div>
          <p className='text-gray-500 text-sm leading-relaxed mb-4'>
            Your trusted healthcare partner. Connecting patients with the best doctors across India.
          </p>
          <div className='flex gap-3'>
            <div className='w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors'>
              <span className='text-blue-600 text-sm font-bold'>f</span>
            </div>
            <div className='w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors'>
              <span className='text-blue-600 text-sm font-bold'>in</span>
            </div>
            <div className='w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors'>
              <span className='text-blue-600 text-sm font-bold'>tw</span>
            </div>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className='font-bold text-gray-800 mb-4 text-base'>Company</h3>
          <ul className='flex flex-col gap-2.5'>
            {['Home', 'About Us', 'Contact Us', 'Privacy Policy'].map((item, i) => (
              <li
                key={i}
                onClick={() => navigate(item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`)}
                className='text-gray-500 text-sm hover:text-blue-600 cursor-pointer transition-colors'>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className='font-bold text-gray-800 mb-4 text-base'>Services</h3>
          <ul className='flex flex-col gap-2.5'>
            {['Book Appointment', 'Find Doctors', 'Video Consultation', 'Health Records', 'Emergency Care'].map((item, i) => (
              <li key={i} className='text-gray-500 text-sm hover:text-blue-600 cursor-pointer transition-colors'>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className='font-bold text-gray-800 mb-4 text-base'>Contact Us</h3>
          <ul className='flex flex-col gap-2.5'>
            <li className='text-gray-500 text-sm flex items-start gap-2'>
              <span>📍</span>
              <span>123 Healthcare Avenue, Mumbai, Maharashtra 400001</span>
            </li>
            <li className='text-gray-500 text-sm flex items-center gap-2'>
              <span>📞</span>
              <span>+91 98765 43210</span>
            </li>
            <li className='text-gray-500 text-sm flex items-center gap-2'>
              <span>✉️</span>
              <span>support@apnacare.in</span>
            </li>
            <li className='text-gray-500 text-sm flex items-center gap-2'>
              <span>🕐</span>
              <span>Mon - Sat: 9AM - 8PM</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className='py-6 flex flex-col md:flex-row items-center justify-between gap-3'>
        <p className='text-gray-400 text-sm'>© 2024 ApnaCare. All rights reserved.</p>
        <div className='flex gap-6'>
          <span className='text-gray-400 text-sm hover:text-blue-600 cursor-pointer transition-colors'>Terms of Service</span>
          <span className='text-gray-400 text-sm hover:text-blue-600 cursor-pointer transition-colors'>Privacy Policy</span>
          <span className='text-gray-400 text-sm hover:text-blue-600 cursor-pointer transition-colors'>Cookie Policy</span>
        </div>
      </div>

    </div>
  )
}

export default Footer