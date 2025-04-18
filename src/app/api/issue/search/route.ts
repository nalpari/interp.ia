import { axiosInstance } from '@/libs/axios'
import { NextRequest, NextResponse } from 'next/server'

const backendURL = process.env.NEXT_PUBLIC_API_URL

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryParams = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      if (value) {
        queryParams.append(key, value)
      }
    }

    const response = await axiosInstance.get(`${backendURL}/api/issues/search`, {
      params: Object.fromEntries(queryParams.entries()),
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in issue API route:', error)
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 })
  }
}
