import { axiosInstance } from '@/libs/axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  const response = await axiosInstance.get(`http://localhost:8080/api/users/${email}`)
  console.log('🚀 ~ GET ~ response:', response)

  return NextResponse.json({ data: response.data })
}
