'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Issue, IssueRequest } from '@/types/issue'

export function useIssue(projectId?: number | null, issueId?: number | null) {
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
      console.log('issue at hook', issue)
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
      queryClient.invalidateQueries({ queryKey: ['issues'] })
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
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] })
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
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })

  return {
    issues,
    issue,
    isIssuesLoading,
    isIssueLoading,
    createIssue: createIssueMutation,
    updateIssue: updateIssueMutation,
    deleteIssue: deleteIssueMutation,
  }
}
