import { LoginedUserInfo } from "@/store/useUserStore"

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
  subIssuesId: number[]
}

export interface Project {
  id: number
  title: string
  subTitle: string
  type: IssueType
  status: IssueStatus
  priority: Priority
  creator : LoginedUserInfo
  assignee: LoginedUserInfo[]
  createdDate: Date
  updatedDate: Date
  dueDate: Date
  startDate: Date
  endDate: Date
  description: string
  tag: string[]
  subIssues: Issue[]
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

export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELED' | 'ANALYSIS' | 'UNPRODUCIBLE'
export type Priority = 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW'
export type IssueType = 'PROJECT' | 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUB_TASK'


export const statusColors: Record<IssueStatus, string> = {
  TODO: 'bg-yellow-100 dark:bg-yellow-900',
  IN_PROGRESS: 'bg-blue-100 dark:bg-blue-900',
  ANALYSIS: 'bg-purple-100 dark:bg-purple-900',
  DONE: 'bg-green-100 dark:bg-green-900',
  CANCELED: 'bg-red-100 dark:bg-red-900',
  UNPRODUCIBLE: 'bg-gray-100 dark:bg-gray-800',
}


export interface Issue {
  id: number
  type: IssueType
  status: IssueStatus
  priority: Priority
  title: string
  subTitle: string
  creator: LoginedUserInfo
  assignee: LoginedUserInfo[]
  createdDate: Date
  updatedDate: Date
  dueDate: Date
  startDate: Date
  endDate: Date
  description: string
  tag: string[]
  parentProject: ProjectRef
  parentIssue: IssueRef
  subIssues: IssueRef[]
  relatedIssues: IssueRef[]
  isDeleted: boolean
}

export interface ProjectRef {
  id: number
  title: string
  type: IssueType
  status: IssueStatus
  priority: Priority
  creator: LoginedUserInfo
  assignee: LoginedUserInfo[]
}

export interface IssueRef {
  id: number
  title: string
  type: IssueType
  status: IssueStatus
  priority: Priority
  creator: LoginedUserInfo
  assignee: LoginedUserInfo[]
  subIssue: IssueRef[]
}

