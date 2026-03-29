import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {

  const backendUrl = 'http://localhost:5000'
  const [token, setToken] = useState(localStorage.getItem('token') || false)
  const [userData, setUserData] = useState(false)
  const [doctors, setDoctors] = useState([])

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`)
      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-profile`,
        {},
        { headers: { token } }
      )
      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(() => {
    if (token) {
      loadUserProfileData()
    } else {
      setUserData(false)
    }
  }, [token])

  const value = {
    backendUrl,
    token, setToken,
    userData, setUserData,
    doctors, getDoctorsData,
    loadUserProfileData
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider