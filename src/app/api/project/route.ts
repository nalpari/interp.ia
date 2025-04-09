import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/libs/session'
import axios from 'axios'
import { axiosInstance } from '@/libs/axios'

const backendURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  const accessToken = session.accessToken

  try {
    const searchParams = request.nextUrl.searchParams
    // 프로젝트 목록 조회
    const response = await axiosInstance.get(`${backendURL}/api/projects`, {
      params: Object.fromEntries(searchParams),
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  const accessToken = session.accessToken
  try {

    const body = await request.json()
    console.log('📍 ~ POST ~ request.body:', body)
    const response = await axiosInstance.post(`${backendURL}/api/projects`, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  const accessToken = session.accessToken

  try {
    const body = await request.json()
    const response = await axiosInstance.patch(`${backendURL}/api/projects/${body.id}`, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
