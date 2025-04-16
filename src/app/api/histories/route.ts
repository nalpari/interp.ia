import { axiosInstance } from '@/libs/axios'
import { NextRequest, NextResponse } from 'next/server'

const backendURL = process.env.NEXT_PUBLIC_API_URL

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const response = await axiosInstance.get(`${backendURL}/api/histories`, {
      params: {
        projectId: projectId,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in history API route:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
