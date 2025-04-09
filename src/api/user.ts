import axios from 'axios'

export const getUser = async (email: string) => {
  const response = await axios.get(`/api/user?email=${email}`)
  return response.data
}

export const getUsers = async (isActive: string | null) => {
  if(!isActive) {
    isActive = 'true'
  }
  const response = await axios.get(`/api/user?isActive=${isActive}`)
  return response.data
}

