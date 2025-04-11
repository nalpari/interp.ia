import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { axiosInstance } from '@/libs/axios'

const backendURL = process.env.NEXT_PUBLIC_API_URL;

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const body = await request.json()
    const response = await axiosInstance.patch(`${backendURL}/api/projects/${id}`, body)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const response = await axiosInstance.get(`${backendURL}/api/projects/${id}`)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
