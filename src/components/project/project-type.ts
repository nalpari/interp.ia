import { UserState } from "@/store/useUserStore"

export interface ProjectRequest {
  title: string
  subTitle: string
  status: IssueStatus
  priority: Priority
  assigneeId: number[]
  dueDate: string
  startDate: string
  endDate: string
  description: string
  tag: string[]
  subIssuesId: number[] | null
}

export interface Project {
  id: number
  title: string
  subTitle: string
  type: IssueType
  status: IssueStatus
  priority: Priority
  creator : UserState
  assignee: UserState[]
  createdDate: Date
  updatedDate: Date
  dueDate: Date
  startDate: Date
  endDate: Date
  description: string
  tag: string[]
  subIssue: null
}

export interface ProjectListRequest {
    status: IssueStatus | null
    priority: Priority | null   
    title: string | null
    subTitle: string | null
    creatorId: number | null
    assigneeId: number[] | null
    createdDateFrom: string | null
    createdDateTo: string | null
    updatedDateFrom: string | null
    updatedDateTo: string | null
    dueDateFrom: string | null
    dueDateTo: string | null
    startDateFrom: string | null
    startDateTo: string | null
    endDateFrom: string | null
    endDateTo: string | null
}

export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | 'ANALYSIS' | 'UNPRODUCIBLE'
export type Priority = 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW'
export type IssueType = 'PROJECT' | 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUB_TASK'
