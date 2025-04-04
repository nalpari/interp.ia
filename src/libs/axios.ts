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
//TODO: 401 에러 처리 로직 추가, 테스트 완료되면 이 주석 해제
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 에러이고, 이미 재시도한 요청이 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const cookieStore = await cookies()
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
        const refreshToken = session.refreshToken

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // refresh token을 사용하여 새로운 access token 요청
        const response = await axios.post(`${baseURL}/auth/refresh`, null, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
          },
        })

        const { accessToken: newAccessToken } = response.data

        // 새로운 access token을 세션에 저장
        session.accessToken = newAccessToken
        await session.save()

        // 실패한 요청의 헤더를 새로운 access token으로 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // 실패한 요청을 새로운 access token으로 재시도
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // refresh token도 만료된 경우 로그아웃 처리
        const cookieStore = await cookies()
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
        session.destroy()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
