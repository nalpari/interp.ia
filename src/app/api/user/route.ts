import { axiosInstance } from '@/libs/axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const isActive = searchParams.get('isActive')

  if (email) {
    const response = await axiosInstance.get(`/api/users/${email}`)
    return NextResponse.json({ data: response.data })
  }

  if (isActive) {
    const response = await axiosInstance.get(`/api/users?isActive=${isActive}`)
    return NextResponse.json({ data: response.data })
  }

  const response = await axiosInstance.get(`/api/users`)
  return NextResponse.json({ data: response.data })
}

export async function PUT(request: Request) {
  const { username, email, position, department, job, phone } = await request.json()
  const data = {
    name: username,
    position,
    department,
    job,
    phone,
  }

  const response = await axiosInstance.put(`/api/users`, data)

  return NextResponse.json({ data })
}
