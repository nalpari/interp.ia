'use server'

import { cookies } from 'next/headers'
import axios from 'axios'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from './session'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    const accessToken = session.accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 에러 처리 로직
    return Promise.reject(error)
  },
)
