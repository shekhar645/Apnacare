import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddDoctor = () => {
  const backendUrl = 'http://localhost:5000'
  const aToken = localStorage.getItem('aToken')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [about, setAbout] = useState('')
  const [fees, setFees] = useState('')
  const [salary, setSalary] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const doctorData = {
        name, email, password, speciality, degree,
        experience, about, fees, salary,
        address: { line1: address1, line2: address2 }
      }
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        doctorData,
        { headers: { aToken } }
      )
      if (data.success) {
        toast.success('Doctor added successfully! 🎉')
        setName(''); setEmail(''); setPassword('')
        setDegree(''); setAbout(''); setFees('')
        setSalary(''); setAddress1(''); setAddress2('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Add New Doctor</h1>

      <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
        <form onSubmit={onSubmitHandler}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Doctor Name</label>
              <input
                type='text'
                placeholder='Dr. Full Name'
                value={name}
                onChange={e => setName(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Email</label>
              <input
                type='email'
                placeholder='doctor@email.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Password</label>
              <input
                type='password'
                placeholder='Set password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Speciality</label>
              <select
                value={speciality}
                onChange={e => setSpeciality(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'>
                <option>General physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Degree</label>
              <input
                type='text'
                placeholder='MBBS, MD etc'
                value={degree}
                onChange={e => setDegree(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Experience</label>
              <select
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'>
                {['1 Year','2 Years','3 Years','4 Years','5 Years','6 Years','7 Years','8 Years','9 Years','10+ Years'].map(y => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Consultation Fees (₹)</label>
              <input
                type='number'
                placeholder='500'
                value={fees}
                onChange={e => setFees(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'
                required
              />
            </div>

            {/* SALARY SELECTION */}
            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>💰 Monthly Salary (₹)</label>
              <select
                value={salary}
                onChange={e => setSalary(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'
                required>
                <option value=''>Select Salary Range</option>
                <option value='50000'>₹50,000 / month</option>
                <option value='75000'>₹75,000 / month</option>
                <option value='100000'>₹1,00,000 / month</option>
                <option value='125000'>₹1,25,000 / month</option>
                <option value='150000'>₹1,50,000 / month</option>
                <option value='175000'>₹1,75,000 / month</option>
                <option value='200000'>₹2,00,000 / month</option>
                <option value='250000'>₹2,50,000 / month</option>
                <option value='300000'>₹3,00,000 / month</option>
                <option value='500000'>₹5,00,000 / month</option>
              </select>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Address Line 1</label>
              <input
                type='text'
                placeholder='Street, Area'
                value={address1}
                onChange={e => setAddress1(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Address Line 2</label>
              <input
                type='text'
                placeholder='City, State'
                value={address2}
                onChange={e => setAddress2(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500'
                required
              />
            </div>

          </div>

          <div className='mb-5'>
            <label className='text-sm font-medium text-gray-700 mb-1.5 block'>About Doctor</label>
            <textarea
              placeholder='Write about the doctor...'
              value={about}
              onChange={e => setAbout(e.target.value)}
              rows={4}
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none'
              required
            />
          </div>

          {/* Salary Summary Box */}
          {salary && (
            <div className='bg-green-50 border border-green-200 rounded-xl p-4 mb-5'>
              <h3 className='font-bold text-green-700 mb-2'>💰 Salary Summary</h3>
              <div className='grid grid-cols-3 gap-3 text-center'>
                <div className='bg-white rounded-lg p-3'>
                  <p className='text-xs text-gray-500'>Monthly</p>
                  <p className='font-bold text-green-600'>₹{Number(salary).toLocaleString()}</p>
                </div>
                <div className='bg-white rounded-lg p-3'>
                  <p className='text-xs text-gray-500'>Yearly</p>
                  <p className='font-bold text-green-600'>₹{(Number(salary) * 12).toLocaleString()}</p>
                </div>
                <div className='bg-white rounded-lg p-3'>
                  <p className='text-xs text-gray-500'>Per Day</p>
                  <p className='font-bold text-green-600'>₹{Math.round(Number(salary) / 30).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 text-white px-10 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-70'>
            {loading ? 'Adding Doctor...' : 'Add Doctor ➕'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddDoctor