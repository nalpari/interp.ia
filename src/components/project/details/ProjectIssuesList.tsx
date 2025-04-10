import { Project } from "@/components/project/project-type"

interface ProjectIssuesListProps {
  project: Project
}

export default function ProjectIssuesList({ project }: ProjectIssuesListProps) {
  return (
    <div  className='mt-10'>
      <div className="bg-card rounded-md border shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b text-sm text-muted-foreground">
          <div className="col-span-2">Issue</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-2">Due Date</div>
        </div>
        {/* TODO: 이슈 리스트 렌더링 */}
      </div>
    </div>
  )
}

