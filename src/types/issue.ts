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
