import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon 😊')
      setName('')
      setEmail('')
      setMessage('')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className='py-8'>

      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 mb-12 text-white text-center'>
        <h1 className='text-4xl font-bold mb-4'>Contact Us</h1>
        <p className='text-blue-100 text-lg max-w-xl mx-auto'>
          Have a question? We are here to help! Reach out to us anytime.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-12'>

        {/* Contact Info */}
        <div>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Get in Touch</h2>

          <div className='flex flex-col gap-5'>
            {[
              { icon: '📍', title: 'Our Address', desc: '123 Healthcare Avenue, Mumbai, Maharashtra 400001' },
              { icon: '📞', title: 'Phone Number', desc: '+91 98765 43210' },
              { icon: '✉️', title: 'Email Address', desc: 'support@apnacare.in' },
              { icon: '🕐', title: 'Working Hours', desc: 'Monday - Saturday: 9AM - 8PM' }
            ].map((item, i) => (
              <div key={i} className='flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all'>
                <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <span className='text-2xl'>{item.icon}</span>
                </div>
                <div>
                  <p className='font-semibold text-gray-800 mb-0.5'>{item.title}</p>
                  <p className='text-gray-500 text-sm'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media */}
          <div className='mt-6'>
            <p className='font-semibold text-gray-800 mb-3'>Follow Us</p>
            <div className='flex gap-3'>
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, i) => (
                <div key={i} className='bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors'>
                  {social}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Send us a Message</h2>

          <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Your Name</label>
              <input
                type='text'
                placeholder='Enter your name'
                value={name}
                onChange={e => setName(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Email Address</label>
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Your Message</label>
              <textarea
                placeholder='How can we help you?'
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none'
                required
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-70'>
              {loading ? 'Sending...' : 'Send Message 📨'}
            </button>
          </form>
        </div>
      </div>

      {/* Map placeholder */}
      <div className='bg-blue-50 border border-blue-100 rounded-2xl h-64 flex items-center justify-center'>
        <div className='text-center'>
          <span className='text-5xl mb-3 block'>🗺️</span>
          <p className='text-blue-600 font-semibold'>123 Healthcare Avenue, Mumbai</p>
          <p className='text-gray-400 text-sm'>Maharashtra 400001, India</p>
        </div>
      </div>

    </div>
  )
}

export default Contact