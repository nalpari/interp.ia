'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { IssueCategory } from '@/types/issue'

export function useHistory(referenceType: IssueCategory, referenceId: number) {
  const { data: historys, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['history', referenceType, referenceId],
    queryFn: async () => {
      if (!referenceType && !referenceId) return []
      try {
        const response = await axios.get(`/api/histories/${referenceType}/${referenceId}`)
        return response.data
      } catch (error) {
        console.error('Error in getHistory:', error)
        return []
      }
    },
    enabled: !!referenceType && !!referenceId,
  })

  return {
    historys: historys || [],
    isHistoryLoading,
  }
}
