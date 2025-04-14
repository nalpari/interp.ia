import { Badge } from '@/components/ui/badge'
import { Issue, priorityLabels, typeIcons } from '../../project-type'

export default function SubIssueCard({ issue }: { issue: Issue }) {
  console.log(issue)
  const formattedDueDate = new Date(issue.dueDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-4 cursor-pointer" title={`기한날짜: ${formattedDueDate}`}>
      <div className="flex justify-between items-center">
        <p>{issue.title}</p>
        <div className="flex items-center gap-2">
          <p title={issue.type} className="cursor-help">
            {typeIcons[issue.type]}
          </p>
          <Badge variant="outline">{priorityLabels[issue.priority]}</Badge>
        </div>
      </div>
    </div>
  )
}
