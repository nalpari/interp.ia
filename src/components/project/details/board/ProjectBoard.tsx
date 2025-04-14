import { Issue, Project, statusColors } from '@/components/project/project-type'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SubIssueCard from './SubIssueCard'
import { useQuery } from '@tanstack/react-query'
import { getIssuesByProjectIssueId as getIssues } from '@/api/issue'

interface ProjectBoardProps {
  project: Project
}

export default function ProjectBoard({ project }: ProjectBoardProps) {

  const {data: issues} = useQuery<Issue[]>({
    queryKey: ['issues', project.id],
    queryFn: () => getIssues(project.id, null),
  })

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex flex-col">
            <div className={`px-3 py-2 rounded-t-md ${color}`}>
              <h3 className="font-bold text-lg">{status}</h3>
              <span className="text-muted-foreground">{project.subIssues?.filter((issue) => issue.status === status).length || 0} issues</span>
            </div>
            <div className="bg-muted/50 p-2 rounded-b-md h-[300px] overflow-y-auto space-y-2">
              {issues
                ?.filter((issue) => issue.status === status)
                .map((issue) => (
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
