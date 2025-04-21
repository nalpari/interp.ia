import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_ISSUE_LIST_REQUEST, Issue, IssueCategory, IssueListRequest, IssueStatus } from '@/types/issue'
import { useIssue } from '@/hooks/useIssue'
import { format } from 'date-fns'
import { useHistory } from '@/hooks/useHistory'

export default function ProjectStatCards({ projectId }: { projectId: number }) {
  // 날짜 계산 유틸리티
  const getDateRange = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sevenDaysToNow = new Date(today)
    sevenDaysToNow.setDate(today.getDate() - 7)

    const sevenDaysFromNow = new Date(today)
    sevenDaysFromNow.setDate(today.getDate() + 7)

    return { today, sevenDaysToNow, sevenDaysFromNow }
  }

  const { today, sevenDaysToNow, sevenDaysFromNow } = getDateRange()

  const issueListRequest: IssueListRequest = {
    ...DEFAULT_ISSUE_LIST_REQUEST,
    projectId: projectId,
    updateDateFrom: format(sevenDaysToNow, 'yyyy-MM-dd'),
    updateDateTo: format(today, 'yyyy-MM-dd'),
  }

  const { issues, searchIssues } = useIssue(projectId, null, issueListRequest)
  const { historys } = useHistory(IssueCategory.PROJECT, projectId)

  // 필터링 유틸리티
  const filterByDateRange = (date: string | Date | null, startDate: Date, endDate: Date) => {
    if (!date) return false
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    return targetDate >= startDate && targetDate <= endDate
  }

  // 통계 계산
  const stats = {
    willBeCompletedIssues: issues.filter((issue: Issue) => filterByDateRange(issue.dueDate, today, sevenDaysFromNow)),

    createdIssues: issues.filter((issue: Issue) => filterByDateRange(issue.createdDate, sevenDaysToNow, today)),

    completedIssues: searchIssues.filter((issue: Issue) => 
      issue.status === IssueStatus.DONE && 
      filterByDateRange(issue.updatedDate, sevenDaysToNow, today)
    ),

    updatedIssues: searchIssues.filter((issue: Issue) => filterByDateRange(issue.updatedDate, sevenDaysToNow, today)),
  }


  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">지난 7일간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedIssues.length}개 완료함</div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">지난 7일간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{historys.length + stats.updatedIssues.length}개 업데이트함</div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">지난 7일간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.createdIssues.length}개 만듦</div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">다음 7일 이내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.willBeCompletedIssues.length}개 마감 예정</div>
        </CardContent>
      </Card>
    </div>
  )
}
