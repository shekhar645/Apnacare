import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const symptoms = {
  'headache': { specialist: 'Neurologist', icon: '🧠' },
  'fever': { specialist: 'General Physician', icon: '🌡️' },
  'chest pain': { specialist: 'Cardiologist', icon: '❤️' },
  'skin rash': { specialist: 'Dermatologist', icon: '🩺' },
  'eye problem': { specialist: 'Ophthalmologist', icon: '👁️' },
  'stomach pain': { specialist: 'Gastroenterologist', icon: '🫃' },
  'back pain': { specialist: 'Orthopedic', icon: '🦴' },
  'anxiety': { specialist: 'Psychiatrist', icon: '🧘' },
  'depression': { specialist: 'Psychiatrist', icon: '🧘' },
  'child fever': { specialist: 'Pediatrician', icon: '👶' },
  'pregnancy': { specialist: 'Gynecologist', icon: '🤰' },
  'tooth pain': { specialist: 'Dentist', icon: '🦷' },
  'cough': { specialist: 'Pulmonologist', icon: '🫁' },
  'breathing': { specialist: 'Pulmonologist', icon: '🫁' },
  'diabetes': { specialist: 'Endocrinologist', icon: '💉' },
  'joint pain': { specialist: 'Orthopedic', icon: '🦴' },
  'ear pain': { specialist: 'ENT Specialist', icon: '👂' },
  'cold': { specialist: 'General Physician', icon: '🌡️' },
  'vomiting': { specialist: 'Gastroenterologist', icon: '🫃' },
  'hair loss': { specialist: 'Dermatologist', icon: '🩺' },
}

const SymptomChecker = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const checkSymptom = () => {
    if (!input.trim()) return
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      const lower = input.toLowerCase()
      let found = null
      for (const key in symptoms) {
        if (lower.includes(key)) {
          found = { keyword: key, ...symptoms[key] }
          break
        }
      }
      setResult(found)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-indigo-700 mb-3'>🩺 AI Symptom Checker</h1>
          <p className='text-gray-600 text-lg'>Describe your symptoms and we will suggest the right specialist</p>
        </div>
        <div className='bg-white rounded-2xl shadow-lg p-8 mb-6'>
          <label className='block text-gray-700 font-semibold mb-3 text-lg'>What symptoms are you experiencing?</label>
          <textarea
            className='w-full border-2 border-indigo-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:border-indigo-500 resize-none text-base'
            rows={4}
            placeholder='e.g. I have headache and fever since 2 days...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={checkSymptom}
            className='mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-lg transition-all duration-200'
          >
            {loading ? 'Analyzing...' : 'Check My Symptoms →'}
          </button>
        </div>
        {result && (
          <div className='bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-indigo-200'>
            <div className='text-6xl mb-4'>{result.icon}</div>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>We recommend a</h2>
            <h3 className='text-3xl font-bold text-indigo-600 mb-4'>{result.specialist}</h3>
            <p className='text-gray-500 mb-6'>Based on your symptom: <span className='font-semibold text-gray-700'>"{result.keyword}"</span></p>
            <button
              onClick={() => navigate('/doctors')}
              className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all'
            >
              Book Appointment Now →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SymptomChecker