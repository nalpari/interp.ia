import { Project, statusColors } from '@/types/project'
import { Issue } from '@/types/project'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SubIssueCard from './SubIssueCard'
import { useIssue } from '@/hooks/useIssue'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrop } from 'react-dnd'

export default function ProjectBoard({ project }: { project: Project }) {
  const { issues, updateIssue } = useIssue(project.id)

  const handleDrop = (issueId: number, newStatus: string) => {
    updateIssue({ issueId, field: 'status', value: newStatus })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(statusColors).map(([status, color]) => (
            <StatusColumn
              key={status}
              status={status}
              color={color}
              issues={issues?.filter((issue: Issue) => issue.status === status) || []}
              onDrop={handleDrop}
              issueCount={project.subIssues?.filter((issue) => issue.status === status).length || 0}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  )
}

interface StatusColumnProps {
  status: string
  color: string
  issues: Issue[]
  onDrop: (issueId: number, newStatus: string) => void
  issueCount: number
}

function StatusColumn({ status, color, issues, onDrop, issueCount }: StatusColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'issue',
    drop: (item: { id: number }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div key={status} className="flex flex-col">
      <div className={`px-3 py-2 rounded-t-md ${color}`}>
        <h3 className="font-bold text-lg">{status}</h3>
        <span className="text-muted-foreground">{issueCount} issues</span>
      </div>
      <div
        ref={drop as any}
        className={`bg-muted/50 p-2 rounded-b-md h-[300px] overflow-y-auto space-y-2 ${
          isOver ? 'ring-2 ring-primary' : ''
        }`}
      >
        {issues.map((issue: Issue) => (
          <SubIssueCard key={issue.id} issue={issue} />
        ))}
        <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm h-auto py-2">
          <Plus /> Add Issue
        </Button>
      </div>
    </div>
  )
}
