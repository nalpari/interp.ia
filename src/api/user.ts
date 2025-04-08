import { ProfileFormValues } from '@/components/dashboard/General'
import { axiosInstance } from '@/libs/axios'
import axios from 'axios'

export const userApi = {
  getUser: async (email: string) => {
    const response = await axios.get(`/api/user?email=${email}`)
    return response.data
  },

  updateUser: async (data: ProfileFormValues) => {
    console.log('🚀 ~ updateUser: ~ data:', data)
    const response = await axios.put(`/api/user`, data)
    return response.data
  },
}
