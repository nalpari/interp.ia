import { ProfileFormValues } from '@/components/dashboard/General'
import axios from 'axios'

export const userApi = {
  getUser: async (email: string) => {
    const response = await axios.get(`/api/user?email=${email}`)
    return response.data
  },

  updateUser: async (data: ProfileFormValues) => {
    const response = await axios.put(`/api/user`, data)
    return response.data
  },
}

export const getUsers = async (isActive: string | null) => {
  if(!isActive) {
    isActive = 'true'
  }
  const response = await axios.get(`/api/user?isActive=${isActive}`)
  return response.data
}

