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
  type: string
  status: string | null
  priority: string | null
  creator: UserType
  assignee: UserType[] | null
  createdDate: string
  updatedDate: string
  dueDate: string | null
  startDate: string | null
  endDate: string | null
  description: string | null
  tag: string[]
  parentProject?: {
    id: number
    title: string
    type: string
    status: string | null
    priority: string | null
    creator: UserType
    assignee: UserType[] | null
  } | null
  parentIssue?: Issue | null
  subIssues?: Issue[] | null
  relatedIssues?: Issue[] | null
}
