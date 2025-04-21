import { axiosInstance } from '@/libs/axios'
import { NextResponse } from 'next/server'

// 이슈 상세 조회
export async function GET(request: Request, { params }: { params: { issueId: string } }) {
  const { issueId } = params

  const response = await axiosInstance.get(`/api/issues/${issueId}`)
  return NextResponse.json(response.data)
}

// 이슈 업데이트
export async function PATCH(request: Request, { params }: { params: { issueId: string } }) {
  const { issueId } = params
  const { updateField, updateValue } = await request.json()

  if (!updateField || !updateValue) {
    return NextResponse.json({ error: 'Field and value are required' }, { status: 400 })
  }

  const response = await axiosInstance.patch(`/api/issues/${issueId}`, {
    [updateField]: updateValue,
  })
  return NextResponse.json(response.data)
}
