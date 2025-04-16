import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Issue } from '@/types/project'
import { useIssue } from '@/hooks/useIssue'
import { useHistory } from '@/hooks/useHistory'
import { IssueCategory, IssueStatus } from '@/types/issue'
import { History } from '@/types/history'

export default function ProjectStatCards({ projectId }: { projectId: number }) {
  const { issues: issuesData } = useIssue(projectId)
  const { childHistorys } = useHistory(IssueCategory.PROJECT, projectId)
  const issues = issuesData || []

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

  // 필터링 유틸리티
  const filterByDateRange = (date: string | Date | null, startDate: Date, endDate: Date) => {
    if (!date) return false
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    return targetDate >= startDate && targetDate <= endDate
  }

  const { today, sevenDaysToNow, sevenDaysFromNow } = getDateRange()

  // 통계 계산
  const stats = {
    willBeCompletedIssues: issues.filter((issue: Issue) => filterByDateRange(issue.dueDate, today, sevenDaysFromNow)).length,

    createdIssues: issues.filter((issue: Issue) => filterByDateRange(issue.createdDate, sevenDaysToNow, today)).length,

    childIssueUpdates: childHistorys.filter((history: History) => filterByDateRange(history.modifiedDate, sevenDaysToNow, today)).length,

    doneIssues: childHistorys.filter(
      (history: History) =>
        history.fieldName === 'status' && history.afterValue === IssueStatus.DONE && filterByDateRange(history.modifiedDate, sevenDaysToNow, today),
    ).length,
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">지난 7일간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.doneIssues}개 완료함</div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">지난 7일간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.childIssueUpdates}개 업데이트함</div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">지난 7일간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.createdIssues}개 만듦</div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">다음 7일 이내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.willBeCompletedIssues}개 마감 예정</div>
        </CardContent>
      </Card>
    </div>
  )
}
