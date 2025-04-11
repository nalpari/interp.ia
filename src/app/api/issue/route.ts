import { axiosInstance } from '@/libs/axios'
import { NextRequest, NextResponse } from 'next/server'

const backendURL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const response = await axiosInstance.get(`${backendURL}/api/issues`, {
      params: Object.fromEntries(searchParams),
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
