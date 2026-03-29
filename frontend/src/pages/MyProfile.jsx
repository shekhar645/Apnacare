import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)

  const updateUserProfileData = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        {
          name: userData.name,
          phone: userData.phone,
          address: JSON.stringify(userData.address),
          gender: userData.gender,
          dob: userData.dob
        },
        { headers: { token } }
      )
      if (data.success) {
        toast.success('Profile updated successfully! ✅')
        await loadUserProfileData()
        setIsEdit(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return userData && (
    <div className='py-8 max-w-2xl'>

      {/* Profile Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white'>
        <div className='flex items-center gap-5'>
          <div className='w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center'>
            <span className='text-4xl font-bold text-white'>
              {userData.name ? userData.name[0].toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            {isEdit
              ? <input
                  type='text'
                  value={userData.name}
                  onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className='bg-white bg-opacity-20 text-white rounded-xl px-3 py-2 text-xl font-bold outline-none border border-white border-opacity-30'
                />
              : <h2 className='text-2xl font-bold mb-1'>{userData.name}</h2>
            }
            <p className='text-blue-200 text-sm'>{userData.email}</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6'>
        <h3 className='font-bold text-blue-600 mb-5 text-sm uppercase tracking-wide'>Contact Information</h3>
        <div className='grid grid-cols-1 gap-5'>

          <div className='flex items-center justify-between py-3 border-b border-gray-100'>
            <div>
              <p className='text-xs text-gray-400 mb-1'>Email Address</p>
              <p className='text-gray-800 font-medium'>{userData.email}</p>
            </div>
            <span className='text-2xl'>✉️</span>
          </div>

          <div className='flex items-center justify-between py-3 border-b border-gray-100'>
            <div className='flex-1'>
              <p className='text-xs text-gray-400 mb-1'>Phone Number</p>
              {isEdit
                ? <input
                    type='text'
                    value={userData.phone}
                    onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                    className='border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 w-full'
                  />
                : <p className='text-gray-800 font-medium'>{userData.phone}</p>
              }
            </div>
            <span className='text-2xl ml-4'>📞</span>
          </div>

          <div className='flex items-center justify-between py-3 border-b border-gray-100'>
            <div className='flex-1'>
              <p className='text-xs text-gray-400 mb-1'>Address</p>
              {isEdit
                ? <div className='flex flex-col gap-2'>
                    <input
                      type='text'
                      placeholder='Address line 1'
                      value={userData.address.line1}
                      onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                      className='border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500'
                    />
                    <input
                      type='text'
                      placeholder='Address line 2'
                      value={userData.address.line2}
                      onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                      className='border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500'
                    />
                  </div>
                : <p className='text-gray-800 font-medium'>{userData.address.line1}, {userData.address.line2}</p>
              }
            </div>
            <span className='text-2xl ml-4'>📍</span>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6'>
        <h3 className='font-bold text-blue-600 mb-5 text-sm uppercase tracking-wide'>Basic Information</h3>
        <div className='grid grid-cols-2 gap-5'>
          <div>
            <p className='text-xs text-gray-400 mb-1'>Gender</p>
            {isEdit
              ? <select
                  value={userData.gender}
                  onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                  className='border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 w-full'>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Other'>Other</option>
                </select>
              : <p className='text-gray-800 font-medium'>{userData.gender}</p>
            }
          </div>
          <div>
            <p className='text-xs text-gray-400 mb-1'>Date of Birth</p>
            {isEdit
              ? <input
                  type='date'
                  value={userData.dob}
                  onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                  className='border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 w-full'
                />
              : <p className='text-gray-800 font-medium'>{userData.dob}</p>
            }
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='flex gap-3'>
        {isEdit
          ? <>
              <button
                onClick={updateUserProfileData}
                className='bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md'>
                Save Changes ✅
              </button>
              <button
                onClick={() => setIsEdit(false)}
                className='bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors'>
                Cancel
              </button>
            </>
          : <button
              onClick={() => setIsEdit(true)}
              className='bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md'>
              Edit Profile ✏️
            </button>
        }
      </div>
    </div>
  )
}

export default MyProfile