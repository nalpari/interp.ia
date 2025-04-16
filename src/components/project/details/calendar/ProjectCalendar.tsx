import { Project, Issue, statusColors } from '@/types/project'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import CustomCalendar from './CustomCalendar'
import { useIssue } from '@/hooks/useIssue'

export default function ProjectCalendar({ project }: { project: Project }) {
  const today = new Date()
  // 오늘 날짜 문자열 생성
  const initialSelectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  // 선택된 날짜 상태 관리
  const [selectedDate, setSelectedDate] = useState<string | null>(initialSelectedDate)

  // 프로젝트 이슈 목록 조회
  const { issues } = useIssue(project.id)

  // 날짜 선택 핸들러
  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  // 날짜 정보 가져오기
  const getDateInfo = () => {
    if (!selectedDate) return null
    // 선택된 날짜 파싱
    const date = new Date(selectedDate)
    // 날짜 포맷팅
    const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(
      2,
      '0',
    )} ${date.toLocaleDateString('en-US', { weekday: 'long' })}`
    // 프로젝트 start, created, due, end 날짜 체크
    const isStartDate = project.startDate && new Date(project.startDate).toISOString().split('T')[0] === selectedDate
    const isCreatedDate = project.createdDate && new Date(project.createdDate).toISOString().split('T')[0] === selectedDate
    const isDueDate = project.dueDate && new Date(project.dueDate).toISOString().split('T')[0] === selectedDate
    const isEndDate = project.endDate && new Date(project.endDate).toISOString().split('T')[0] === selectedDate
    // 선택된 날짜의 이슈 리스트 조회
    const dateIssues = issues?.filter((issue: Issue) => String(issue.dueDate) === selectedDate) || []

    return (
      <div className="space-y-4">
        <div className="text-xl font-bold">{formattedDate}</div>
        <div className="space-y-2">
          {isStartDate && (
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Project Start Date
            </div>
          )}
          {isCreatedDate && (
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Project Created Date
            </div>
          )}
          {isDueDate && (
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Project Due Date
            </div>
          )}
          {isEndDate && (
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Project End Date
            </div>
          )}
        </div>
        {dateIssues.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Issues :</div>
            <div className="space-y-2">
              {dateIssues.map((issue: Issue) => (
                <div key={issue.id} className={'text-sm p-2 rounded bg-muted flex items-center justify-between'}>
                  {issue.title}
                  <Badge variant="outline" className={`ml-2 ${statusColors[issue.status]}`}>
                    {issue.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 border rounded-xl p-4">
          <CustomCalendar project={project} issues={issues} onDateSelect={handleDateSelect} />
        </div>
        <div className="border rounded-xl p-4 bg-card">{getDateInfo()}</div>
      </div>
    </div>
  )
}
