import { axiosInstance } from '@/libs/axios'
import { NextResponse } from 'next/server'
import { Issue, IssueRequest } from '@/types/issue'

// 특정 프로젝트 하위 이슈 목록 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
  }

  const response = await axiosInstance.get(`/api/issues?projectId=${projectId}`)
  console.log('response at route', response)
  return NextResponse.json(response.data)
}

// 이슈 생성
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('body at route', body)
    const response = await axiosInstance.post(`/api/issues`, body)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in issue API route:', error)
    return NextResponse.json({ error: 'Failed to create issue', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

// 이슈 업데이트 또는 삭제
export async function PATCH(request: Request) {
  const { pathname } = new URL(request.url)
  const issueId = pathname.split('/').pop()

  // 이슈 삭제
  if (pathname.endsWith('/delete')) {
    const response = await axiosInstance.patch(`/api/issues/${issueId}/delete`)
    return NextResponse.json(response.data)
  }

  // 이슈 업데이트
  const { updateField, updateValue } = await request.json()

  if (!issueId || !updateField || !updateValue) {
    return NextResponse.json({ error: 'Issue ID, field, and value are required' }, { status: 400 })
  }

  const response = await axiosInstance.patch(`/api/issues/${issueId}`, {
    [updateField]: updateValue,
  })
  return NextResponse.json(response.data)
}
