import { Issue } from '@/types/project'
import { IssueBadge } from '@/components/issue/IssueBadge'
import { useDrag } from 'react-dnd'

export default function SubIssueCard({ issue }: { issue: Issue }) {
  const formattedDueDate = new Date(issue.dueDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'issue',
    item: { id: issue.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag as any}
      className={`bg-white dark:bg-gray-800 rounded-md p-4 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      title={`기한날짜: ${formattedDueDate}`}
    >
      <div className="flex justify-between items-center">
        <p>{issue.title}</p>
        <div className="flex items-center gap-2">
          <IssueBadge type="type" value={issue.type} />
          <IssueBadge type="priority" value={issue.priority} />
        </div>
      </div>
    </div>
  )
}
