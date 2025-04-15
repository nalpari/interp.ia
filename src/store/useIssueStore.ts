import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Issue } from '@/types/issue'

interface IssueState {
  selectedIssue: Issue | null
  setSelectedIssue: (issue: Issue | null) => void
  clearSelectedIssue: () => void
  updateIssueField: (issueId: number, field: string, value: any) => void
}

export const useIssueStore = create<IssueState>()(
  devtools(
    (set) => ({
      selectedIssue: null,
      setSelectedIssue: (issue) => set({ selectedIssue: issue }),
      clearSelectedIssue: () => set({ selectedIssue: null }),
      updateIssueField: (issueId, field, value) =>
        set((state) => {
          if (state.selectedIssue && state.selectedIssue.id === issueId) {
            return {
              selectedIssue: {
                ...state.selectedIssue,
                [field]: value,
              },
            }
          }
          return state
        }),
    }),
    { name: 'issue-store' },
  ),
)
