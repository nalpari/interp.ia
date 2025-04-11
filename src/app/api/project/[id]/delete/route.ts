import { NextRequest, NextResponse } from 'next/server'

import { axiosInstance } from '@/libs/axios'

const backendURL = process.env.NEXT_PUBLIC_API_URL

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const response = await axiosInstance.patch(`${backendURL}/api/projects/${id}/delete`)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in project API route:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
