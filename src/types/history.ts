import { LoginedUserInfo } from '@/store/useUserStore'
import { IssueCategory } from './issue'

export type History = {
  id: number
  category: IssueCategory
  issueId: number
  fieldName: string
  beforeValue: string
  afterValue: string
  modifiedDate: Date
  modifier: LoginedUserInfo
}
