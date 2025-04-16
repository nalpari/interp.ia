// /api/history/[referenceType]/[referenceId]/route.ts
import { axiosInstance } from '@/libs/axios'
import { NextRequest, NextResponse } from 'next/server'

const backendURL = process.env.NEXT_PUBLIC_API_URL

export async function GET(request: NextRequest, { params }: { params: { referenceType: string; referenceId: string } }) {
  try {
    const { referenceType, referenceId } = params
    const response = await axiosInstance.get(`${backendURL}/api/histories/${referenceType}/${referenceId}`)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in history API route:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
