import { axiosInstance } from '@/libs/axios'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: { params: { issueId: string } }) {
  const { issueId } = params

  const response = await axiosInstance.patch(`http://localhost:8080/api/issues/${issueId}/delete`)
  return NextResponse.json(response.data)
}
