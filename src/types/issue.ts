import { IssueRef, ProjectRef } from "./project"

import { Project } from "./project"

export enum IssueType {
  PROJECT = 'PROJECT',
  EPIC = 'EPIC',
  STORY = 'STORY',
  TASK = 'TASK',
  BUG = 'BUG',
  SUB_TASK = 'SUB_TASK',
}

export enum IssueStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELED = 'CANCELED',
  ANALYSIS = 'ANALYSIS',
  UNPRODUCIBLE = 'UNPRODUCIBLE',
}

export enum IssuePriority {
  EMERGENCY = 'EMERGENCY',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum IssueCategory {
  PROJECT = 'PROJECT',
  ISSUE = 'ISSUE',
}

export type UserType = {
  id: number
  email: string
  name: string
  image: string | null
  position: string | null
  department: string | null
  job: string | null
  phone: string | null
  isActive: boolean
}

export type Issue = {
  id: number
  title: string
  subTitle: string | null
  type: IssueType
  status: IssueStatus
  priority: IssuePriority
  creator: UserType
  assignee: UserType[] | null
  createdDate: Date
  updatedDate: Date
  dueDate: Date | null
  startDate: Date | null
  endDate: Date | null
  description: string | null
  tag: string[]
  parentProject?: ProjectRef | null
  parentIssue?: IssueRef | null
  subIssues?: IssueRef[] | null
  relatedIssues?: IssueRef[] | null
}

export type IssueRequest = {
  title: string
  subTitle: string | null
  type: IssueType
  status: IssueStatus | null
  priority: IssuePriority | null
  assigneeId: number[] | null
  dueDate: Date | null
  startDate: Date | null
  endDate: Date | null
  description: string | null
  tag: string[] | null
  parentProjectId: number
  parentIssueId: number | null
  relatedIssuesId: number[] | null
}

export type IssueListRequest = {
  projectId: number | null
  parentIssueId: number | null
  issueId: number | null
  status: IssueStatus | null
  priority: IssuePriority | null
  title: string | null
  subTitle: string | null
  creatorId: number | null
  assigneeId: number[] | null
  createDateFrom: Date | null
  createDateTo: Date | null
  updateDateFrom: Date | null
  updateDateTo: Date | null
  dueDateFrom: Date | null
  dueDateTo: Date | null
  startDateFrom: Date | null
  startDateTo: Date | null
  endDateFrom: Date | null
  endDateTo: Date | null
}

export const DEFAULT_ISSUE_LIST_REQUEST = {
  status: null,
  priority: null,
  title: null,
  subTitle: null,
  creatorId: null,
  assigneeId: null,
  createDateFrom: null,
  createDateTo: null,
  updateDateFrom: null,
  updateDateTo: null,
  dueDateFrom: null,
  dueDateTo: null,
  startDateFrom: null,
  startDateTo: null,
  endDateFrom: null,
  endDateTo: null,
  parentIssueId: null,
  issueId: null,
} as const
