import { Issue } from '@/types/issue'
import { IssueBadge } from '@/components/issue/IssueBadge'
import { useDrag } from 'react-dnd'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function SubIssueCard({ issue, onSelectIssue }: { issue: Issue; onSelectIssue: (issue: Issue) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'issue',
    item: { id: issue.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <TooltipProvider>
      <div
        ref={drag as any}
        className={`bg-white dark:bg-gray-800 rounded-md p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isDragging ? 'opacity-50' : ''
        }`}
        title={issue.title}
        onClick={() => onSelectIssue(issue)}
      >
        <div className="flex justify-between items-center">
          <p>{issue.title}</p>
          <div className="flex items-center gap-2">
            <IssueBadge type="type" value={issue.type} />
            <IssueBadge type="priority" value={issue.priority} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
