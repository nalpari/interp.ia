import { NextRequest, NextResponse } from "next/server"

import { axiosInstance } from "@/libs/axios"
import { sessionOptions } from "@/libs/session"

import { SessionData } from "@/libs/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

const backendURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    const accessToken = session.accessToken
    const id = params.id
  
    try {
      const response = await axiosInstance.patch(`${backendURL}/api/projects/${id}/delete`, {
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