import { SessionData, sessionOptions } from '@/libs/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, accessToken, refreshToken, isLoggedIn } = await request.json()
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  console.log('🚀 ~ POST ~ isLoggedIn:', isLoggedIn)
  console.log('🚀 ~ POST ~ refreshToken:', refreshToken)
  console.log('🚀 ~ POST ~ accessToken:', accessToken)
  console.log('🚀 ~ POST ~ email:', email)

  session.email = email
  session.accessToken = accessToken
  session.refreshToken = refreshToken
  session.isLoggedIn = isLoggedIn
  await session.save()

  return NextResponse.json({ message: 'Session saved' })
}
