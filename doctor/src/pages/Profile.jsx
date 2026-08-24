import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const dToken = localStorage.getItem('dToken')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [fees, setFees] = useState('')
  const [available, setAvailable] = useState(false)

  const getProfile = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/profile`, {},
        { headers: { dtoken: dToken } }
      )
      if (data.success) {
        setProfile(data.doctor)
        setFees(data.doctor.fees)
        setAvailable(data.doctor.available)
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        { fees, available },
        { headers: { dtoken: dToken } }
      )
      if (data.success) {
        toast.success('Profile updated!')
        setEditing(false)
        getProfile()
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => { getProfile() }, [])

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
    </div>
  )

  if (!profile) return null

  return (
    <div className='max-w-2xl'>
      <h2 className='text-xl font-bold text-gray-800 mb-6'>My Profile</h2>

      {/* Profile Card */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6'>
        {/* Banner */}
        <div className='h-24 bg-gradient-to-r from-blue-600 to-blue-400'></div>

        {/* Avatar & Name */}
        <div className='px-6 pb-6'>
          <div className='-mt-12 mb-4'>
            <img
              src={profile.image}
              alt={profile.name}
              className='w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md'
            />
          </div>
          <h3 className='text-xl font-bold text-gray-800'>{profile.name}</h3>
          <p className='text-blue-600 font-medium text-sm'>{profile.speciality}</p>

          <div className='grid grid-cols-2 gap-4 mt-5'>
            {[
              { label: 'Degree', value: profile.degree },
              { label: 'Experience', value: profile.experience },
              { label: 'Email', value: profile.email },
              { label: 'Address', value: profile.address?.line1 },
            ].map((item, i) => (
              <div key={i} className='bg-gray-50 rounded-xl p-3'>
                <p className='text-xs text-gray-400 mb-1'>{item.label}</p>
                <p className='text-sm font-medium text-gray-700'>{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editable Section */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
        <div className='flex items-center justify-between mb-5'>
          <h4 className='font-bold text-gray-800'>Settings</h4>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className='text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-100 transition-all'
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {/* Availability Toggle */}
        <div className='flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4'>
          <div>
            <p className='font-medium text-gray-700 text-sm'>Availability</p>
            <p className='text-xs text-gray-400 mt-0.5'>Show as available for booking</p>
          </div>
          <button
            onClick={() => editing && setAvailable(!available)}
            className={`w-12 h-6 rounded-full transition-all ${
              available ? 'bg-green-500' : 'bg-gray-300'
            } ${!editing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-all mx-0.5 ${
              available ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </button>
        </div>

        {/* Fees */}
        <div className='p-4 bg-gray-50 rounded-xl mb-5'>
          <p className='font-medium text-gray-700 text-sm mb-2'>Consultation Fees (₹)</p>
          <input
            type='number'
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            disabled={!editing}
            className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400'
          />
        </div>

        {editing && (
          <div className='flex gap-3'>
            <button
              onClick={updateProfile}
              className='flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm'
            >
              Save Changes
            </button>
            <button
              onClick={() => { setEditing(false); setFees(profile.fees); setAvailable(profile.available) }}
              className='flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm'
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile