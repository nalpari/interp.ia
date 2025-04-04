'use server'

import { cookies } from 'next/headers'
import { SessionData, sessionOptions } from '@/libs/session'
import { getIronSession } from 'iron-session'
import { redirect } from 'next/navigation'

export interface LoginData {
  email: string
  password: string
}

export const signOut = async () => {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  session.destroy()
  redirect('/login')
}

export const setSession = async (data: SessionData) => {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  session.email = data.email
  session.accessToken = data.accessToken
  session.refreshToken = data.refreshToken
  session.isLoggedIn = data.isLoggedIn
  session.save()
}

export const getSession = async () => {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}
