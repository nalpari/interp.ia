import axios from 'axios'

export const getUser = async (email: string) => {
  const response = await axios.get(`/api/user?email=${email}`)
  return response.data
}
