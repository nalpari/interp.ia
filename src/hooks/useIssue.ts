'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IssueListRequest, IssueRequest } from '@/types/issue'

export function useIssue(projectId?: number | null, issueId?: number | null, issueListRequest?: IssueListRequest) {
  const queryClient = useQueryClient()

  // 이슈 목록 조회
  const { data: issues, isLoading: isIssuesLoading } = useQuery({
    queryKey: ['issues', projectId],
    queryFn: async () => {
      if (!projectId) return []
      const response = await fetch(`/api/issue?projectId=${projectId}`)
      return response.json()
    },
    enabled: !!projectId,
  })
  // 이슈 검색 목록 조회
  const { data: searchIssues, isLoading: isSearchIssuesLoading } = useQuery({
    queryKey: ['searchIssues', projectId, issueListRequest],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (issueListRequest) {
        Object.entries(issueListRequest).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await fetch(`/api/issue/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.json()
    },
    enabled: !!issueListRequest,
  })

  // 이슈 상세 조회
  const { data: issue, isLoading: isIssueLoading } = useQuery({
    queryKey: ['issue', issueId],
    queryFn: async () => {
      if (!issueId) return null
      const response = await fetch(`/api/issue/${issueId}`)
      return response.json()
    },
    enabled: !!issueId,
  })

  // 이슈 생성
  const { mutate: createIssueMutation } = useMutation({
    mutationFn: async (issue: IssueRequest) => {
      const response = await fetch('/api/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issue),
      })
      return response.json()
    },
    onSuccess: () => {
      // issue query 무효화
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      // history query 무효화
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })

  // 이슈 업데이트
  const { mutate: updateIssueMutation } = useMutation({
    mutationFn: async ({ issueId, field, value }: { issueId: number; field: string; value: string }) => {
      const response = await fetch(`/api/issue/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updateField: field, updateValue: value }),
      })
      return response.json()
    },
    onSuccess: (_, { issueId }) => {
      // issue query 무효화
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] })
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] })
      queryClient.invalidateQueries({ queryKey: ['searchIssues', projectId] })
      // history query 무효화
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })

  // 이슈 삭제
  const { mutate: deleteIssueMutation } = useMutation({
    mutationFn: async (issueId: number) => {
      const response = await fetch(`/api/issue/${issueId}/delete`, {
        method: 'PATCH',
      })
      return response.json()
    },
    onSuccess: () => {
      // issue query 무효화
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      // history query 무효화
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })

  return {
    issues: issues || [],
    searchIssues: searchIssues || [],
    issue,
    isIssuesLoading,
    isIssueLoading,
    isSearchIssuesLoading,
    createIssue: createIssueMutation,
    updateIssue: updateIssueMutation,
    deleteIssue: deleteIssueMutation,
  }
}
