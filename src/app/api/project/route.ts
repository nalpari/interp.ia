import { NextRequest, NextResponse } from 'next/server'
import { axiosInstance } from '@/libs/axios'

const backendURL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    // 프로젝트 목록 조회
    const response = await axiosInstance.get(`${backendURL}/api/projects`, {
      params: Object.fromEntries(searchParams),
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await axiosInstance.post(`${backendURL}/api/projects`, body)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await axiosInstance.patch(`${backendURL}/api/projects/${body.id}`, body)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
