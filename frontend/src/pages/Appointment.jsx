import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// ── Payment Form Component ──
const PaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { backendUrl, token } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const handlePay = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/create-payment-intent`,
        { amount },
        { headers: { token } }
      )
      if (!data.success) { toast.error(data.message); setLoading(false); return }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      })

      if (result.error) {
        toast.error(result.error.message)
        setLoading(false)
      } else if (result.paymentIntent.status === 'succeeded') {
        toast.success('Payment successful! 💳')
        onSuccess()
      }
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4'>
      <div className='bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl'>
        <h3 className='text-xl font-bold text-gray-800 mb-2'>Complete Payment</h3>
        <p className='text-gray-500 text-sm mb-6'>Secure payment powered by Stripe</p>

        <div className='bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between'>
          <span className='text-gray-600 font-medium'>Consultation Fee</span>
          <span className='text-2xl font-bold text-blue-600'>₹{amount}</span>
        </div>

        <form onSubmit={handlePay}>
          <div className='border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50'>
            <CardElement options={{
              style: {
                base: { fontSize: '16px', color: '#1f2937', '::placeholder': { color: '#9ca3af' } },
                invalid: { color: '#ef4444' }
              }
            }} />
          </div>

          <div className='flex gap-3'>
            <button type='button' onClick={onCancel}
              className='flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all'>
              Cancel
            </button>
            <button type='submit' disabled={!stripe || loading}
              className='flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed'>
              {loading ? 'Processing...' : `Pay ₹${amount}`}
            </button>
          </div>
        </form>

        <div className='flex items-center justify-center gap-2 mt-4'>
          <span className='text-xs text-gray-400'>🔒 Secured by Stripe</span>
        </div>
      </div>
    </div>
  )
}

// ── Main Appointment Component ──
const AppointmentInner = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, token, backendUrl, getDoctorsData } = useContext(AppContext)

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [showPayment, setShowPayment] = useState(false)

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlots = async () => {
    setDocSlots([])
    let today = new Date()
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const handleBookClick = () => {
    if (!token) {
      toast.warning('Please login to book appointment!')
      return navigate('/login')
    }
    if (!slotTime) {
      toast.warning('Please select a time slot!')
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = async () => {
    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      const slotDate = `${day}_${month}_${year}`

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      )
      if (data.success) {
        toast.success('Appointment booked successfully! 🎉')
        getDoctorsData()
        setShowPayment(false)
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => { fetchDocInfo() }, [doctors, docId])
  useEffect(() => { if (docInfo) getAvailableSlots() }, [docInfo])

  return docInfo && (
    <div className='py-8'>
      {showPayment && (
        <PaymentForm
          amount={docInfo.fees}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      <div className='flex flex-col md:flex-row gap-6 mb-8'>
        <div className='md:w-72 flex-shrink-0'>
          <div className='bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl overflow-hidden h-72 flex items-center justify-center shadow-xl'>
            <img src={docInfo.image} alt={docInfo.name} className='w-full h-full object-cover' />
          </div>
        </div>
        <div className='flex-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-1'>{docInfo.name}</h2>
              <p className='text-blue-600 font-medium'>{docInfo.degree} — {docInfo.speciality}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${docInfo.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${docInfo.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {docInfo.available ? 'Available' : 'Not Available'}
            </div>
          </div>
          <div className='flex items-center gap-4 mb-4'>
            <div className='flex items-center gap-1'>
              <span>⭐</span>
              <span className='font-bold text-gray-700'>4.8</span>
              <span className='text-gray-400 text-sm'>(120 reviews)</span>
            </div>
            <div className='text-gray-300'>|</div>
            <span className='text-gray-600 text-sm'>{docInfo.experience} experience</span>
          </div>
          <div className='bg-blue-50 rounded-xl p-4 mb-4'>
            <p className='text-sm font-semibold text-gray-700 mb-1'>About</p>
            <p className='text-gray-600 text-sm leading-relaxed'>{docInfo.about}</p>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs text-gray-400'>Consultation Fee</p>
              <p className='text-2xl font-bold text-blue-600'>₹{docInfo.fees}</p>
            </div>
            <div className='text-right'>
              <p className='text-xs text-gray-400'>Location</p>
              <p className='text-sm font-medium text-gray-600'>📍 {docInfo.address.line1}</p>
              <p className='text-sm text-gray-500'>{docInfo.address.line2}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm'>
        <h3 className='text-xl font-bold text-gray-800 mb-6'>Select Appointment Slot</h3>
        <div className='flex gap-3 overflow-x-auto pb-4 mb-6'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div key={index} onClick={() => setSlotIndex(index)}
              className={`flex flex-col items-center min-w-16 py-4 px-3 rounded-2xl cursor-pointer transition-all ${slotIndex === index ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-gray-50 text-gray-600 hover:bg-blue-50 border border-gray-100'}`}>
              <p className='text-xs font-medium mb-1'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p className='text-xl font-bold'>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>
        <div className='flex flex-wrap gap-3 mb-8'>
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <div key={index} onClick={() => setSlotTime(item.time)}
              className={`px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all ${item.time === slotTime ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-blue-50 border border-gray-100'}`}>
              {item.time.toLowerCase()}
            </div>
          ))}
        </div>
        <button onClick={handleBookClick}
          className='w-full md:w-auto bg-blue-600 text-white px-12 py-4 rounded-2xl font-semibold text-base hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl'>
          Book Appointment 🎯
        </button>
      </div>
    </div>
  )
}

// ── Wrapper with Stripe Provider ──
const Appointment = () => {
  return (
    <Elements stripe={stripePromise}>
      <AppointmentInner />
    </Elements>
  )
}

export default Appointment
