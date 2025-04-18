import { Project, statusColors } from '@/types/project'
import { DEFAULT_ISSUE_LIST_REQUEST, Issue, IssueListRequest, IssueRequest } from '@/types/issue'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SubIssueCard from './SubIssueCard'
import { useIssue } from '@/hooks/useIssue'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrop } from 'react-dnd'
import { useState } from 'react'
import { IssueDetail } from '@/components/issue/IssueDetail'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import { IssueCreateForm } from '@/components/issue/IssueCreateForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
export default function ProjectBoard({ project }: { project: Project }) {
  const [issueListRequest, setIssueListRequest] = useState<IssueListRequest>({
    ...DEFAULT_ISSUE_LIST_REQUEST,
    projectId: project.id,
  })

  const { searchIssues, updateIssue } = useIssue(project.id, null, issueListRequest)
  console.log('searchIssues', searchIssues)

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

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
              issues={searchIssues?.filter((issue: Issue) => issue.status === status) || []}
              onDrop={handleDrop}
              issueCount={project.subIssues?.filter((issue) => issue.status === status).length || 0}
              onSelectIssue={setSelectedIssue}
              projectId={project.id}
            />
          ))}
        </div>
      </div>

      {selectedIssue && (
        <TooltipProvider>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedIssue(null)}>
            <div
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-background border-l shadow-lg flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full overflow-y-auto">
                <Card className="p-2">
                  <IssueDetail issue={selectedIssue} onSelectIssue={setSelectedIssue} onClose={() => setSelectedIssue(null)} />
                </Card>
              </div>
            </div>
          </div>
        </TooltipProvider>
      )}
    </DndProvider>
  )
}

interface StatusColumnProps {
  projectId: number
  status: string
  color: string
  issues: Issue[]
  onDrop: (issueId: number, newStatus: string) => void
  issueCount: number
  onSelectIssue: (issue: Issue) => void
}

function StatusColumn({ status, color, issues, onDrop, issueCount, onSelectIssue, projectId }: StatusColumnProps) {
  const { createIssue } = useIssue(projectId)
  const [isOpen, setIsOpen] = useState(false)

  const handleCreateIssue = (formData: IssueRequest) => {
    createIssue(formData)
    setIsOpen(false)
  }

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
      <div ref={drop as any} className={`bg-muted/50 p-2 rounded-b-md h-[300px] overflow-y-auto space-y-2 ${isOver ? 'ring-2 ring-primary' : ''}`}>
        {issues.map((issue: Issue) => (
          <SubIssueCard key={issue.id} issue={issue} onSelectIssue={onSelectIssue} />
        ))}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="w-full">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm h-auto py-2">
                <Plus /> Add Issue
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Issue</DialogTitle>
            </DialogHeader>
            <IssueCreateForm parentIssue={null} onSubmit={handleCreateIssue} parentProjectId={projectId} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
