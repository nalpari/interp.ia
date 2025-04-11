import { Project, IssueStatus } from '@/components/project/project-type'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SubIssueCard from './SubIssueCard'

interface ProjectBoardProps {
  project: Project
}

const statusColors: Record<IssueStatus, string> = {
  TODO: 'bg-yellow-100 dark:bg-yellow-900',
  IN_PROGRESS: 'bg-blue-100 dark:bg-blue-900',
  ANALYSIS: 'bg-purple-100 dark:bg-purple-900',
  DONE: 'bg-green-100 dark:bg-green-900',
  CANCELED: 'bg-red-100 dark:bg-red-900',
  UNPRODUCIBLE: 'bg-gray-100 dark:bg-gray-800',
}

export default function ProjectBoard({ project }: ProjectBoardProps) {
  return (
    <div className='mt-10'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex flex-col">
            <div className={`px-3 py-2 rounded-t-md ${color}`}>
              <h3 className="font-bold text-lg">{status}</h3>
              <span className='text-muted-foreground'>{project.subIssues?.filter((issue) => issue.status === status).length || 0} issues</span>
            </div>
            <div className="bg-muted/50 p-2 rounded-b-md h-[300px] overflow-y-auto">
              {project.subIssues?.filter((issue) => issue.status === status).map((issue) => (
                <SubIssueCard key={issue.id} issue={issue} />
              ))}
              <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm h-auto py-2">
                <Plus /> Add Issue
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
