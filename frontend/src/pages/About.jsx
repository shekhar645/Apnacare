import React from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className='py-8'>

      {/* Hero Section */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 mb-12 text-white text-center'>
        <h1 className='text-4xl font-bold mb-4'>About ApnaCare</h1>
        <p className='text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed'>
          We are on a mission to make quality healthcare accessible to everyone across India and beyond.
        </p>
      </div>

      {/* Mission Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 items-center'>
        <div>
          <p className='text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2'>Our Mission</p>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>Healthcare for Everyone</h2>
          <p className='text-gray-500 leading-relaxed mb-4'>
            At ApnaCare, we believe that everyone deserves access to quality healthcare. We connect patients with the best doctors across India and abroad, making it easy to book appointments, consult specialists, and manage your health — all in one place.
          </p>
          <p className='text-gray-500 leading-relaxed'>
            Whether you need a general physician in your city or a specialist from London or Singapore, ApnaCare brings world-class healthcare to your fingertips.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          {[
            { icon: '🏥', title: '500+', desc: 'Verified Doctors' },
            { icon: '🌍', title: '10+', desc: 'Countries' },
            { icon: '😊', title: '10k+', desc: 'Happy Patients' },
            { icon: '⭐', title: '4.8', desc: 'Average Rating' }
          ].map((item, i) => (
            <div key={i} className='bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all'>
              <div className='text-3xl mb-2'>{item.icon}</div>
              <p className='text-2xl font-bold text-blue-600'>{item.title}</p>
              <p className='text-gray-500 text-sm'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className='mb-12'>
        <div className='text-center mb-8'>
          <p className='text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2'>Why Choose Us</p>
          <h2 className='text-3xl font-bold text-gray-800'>Our Core Values</h2>
          <div className='w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full'></div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            { icon: '🔒', title: 'Trust & Safety', desc: 'All doctors are verified and certified. Your health data is completely secure and private.' },
            { icon: '💙', title: 'Patient First', desc: 'We put patients at the center of everything we do. Your comfort and care is our top priority.' },
            { icon: '🌟', title: 'Excellence', desc: 'We partner only with the best doctors who have proven track records and excellent patient reviews.' },
            { icon: '⚡', title: 'Quick & Easy', desc: 'Book an appointment in under 2 minutes. No waiting, no paperwork, just healthcare made simple.' },
            { icon: '🌍', title: 'Global Reach', desc: 'Access doctors from India, UK, UAE, Singapore, USA and more — all from the comfort of your home.' },
            { icon: '💊', title: 'Complete Care', desc: 'From booking to prescription to follow-up — we support your entire healthcare journey.' }
          ].map((item, i) => (
            <div key={i} className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1'>
              <div className='text-3xl mb-3'>{item.icon}</div>
              <h3 className='font-bold text-gray-800 mb-2'>{item.title}</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className='mb-12'>
        <div className='text-center mb-8'>
          <p className='text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2'>Our Team</p>
          <h2 className='text-3xl font-bold text-gray-800'>Meet the Founders</h2>
          <div className='w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full'></div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            { name: 'Shekhar Kumar', role: 'CEO & Founder', initial: 'S', color: 'from-blue-400 to-blue-600' },
            { name: 'Dr. Priya Sharma', role: 'Chief Medical Officer', initial: 'P', color: 'from-teal-400 to-teal-600' },
            { name: 'Rahul Mehta', role: 'CTO & Co-Founder', initial: 'R', color: 'from-purple-400 to-purple-600' }
          ].map((member, i) => (
            <div key={i} className='bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all'>
              <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <span className='text-white text-3xl font-bold'>{member.initial}</span>
              </div>
              <h3 className='font-bold text-gray-800 mb-1'>{member.name}</h3>
              <p className='text-blue-600 text-sm font-medium'>{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 text-center text-white'>
        <h2 className='text-3xl font-bold mb-4'>Join the ApnaCare Family</h2>
        <p className='text-blue-100 mb-6'>Start your healthcare journey with us today</p>
        <button
          onClick={() => navigate('/doctors')}
          className='bg-white text-blue-600 px-10 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg'>
          Find a Doctor →
        </button>
      </div>

    </div>
  )
}

export default About