import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Issue, IssueStatus, Project } from '@/components/project/project-type'
import { getIssuesByProjectIssueId } from '@/api/issue'
import { useQuery } from '@tanstack/react-query'

export default function ProjectStatCards({ project }: { project: Project }) {
  const { data: issues } = useQuery<Issue[]>({
    queryKey: ['issues', project.id],
    queryFn: () => getIssuesByProjectIssueId(project.id, null),
  })
  // 지난 7일
  const sevenDaysToNow = new Date();
  sevenDaysToNow.setDate(sevenDaysToNow.getDate() - 7);
  // 다음 7일
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  // 오늘 자정
  const today = new Date();
  today.setHours(0, 0, 0, 0);  

  // 다음 7일 이내 마감 예정 이슈 수
  const willBeCompletedIssues = issues?.filter((issue) => {
    if (!issue.dueDate) return false;
    const dueDate = new Date(issue.dueDate);
    dueDate.setHours(0, 0, 0, 0);  
    return dueDate >= today && dueDate <= sevenDaysFromNow;
  }).length;

  // 지난 7일 이내 만든 이슈 수
  const createdIssues = issues?.filter((issue) => {
    if(!issue.createdDate) return false;
    const createdDate = new Date(issue.createdDate);
    createdDate.setHours(0, 0, 0, 0);
    return createdDate >= sevenDaysToNow && createdDate <= today;
  }).length;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">지난 7일간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{0}개 완료함</div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">지난 7일간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{0}개 업데이트함</div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">지난 7일간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{createdIssues}개 만듦</div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">다음 7일 이내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{willBeCompletedIssues}개 마감 예정</div>
        </CardContent>
      </Card>
    </div>
  )
}
