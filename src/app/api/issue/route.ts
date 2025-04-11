import { axiosInstance } from '@/libs/axios'
import { SessionData } from '@/libs/session'
import { sessionOptions } from '@/libs/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const backendURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  const accessToken = session.accessToken

  try {
    const searchParams = request.nextUrl.searchParams
    const response = await axiosInstance.get(`${backendURL}/api/issues`, {
      params: Object.fromEntries(searchParams),
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    })
    return NextResponse.json(response.data)
  } catch (error : any) {
    console.error('Error in getIssuesByProjectIssueId:', error, {
        message: error.message,
        stack: error.stack,
        status: error.response?.status,
        data: error.response?.data,
    })
    return NextResponse.json({ error: 'Error in issue API route' }, { status: 500 })
  }
}
