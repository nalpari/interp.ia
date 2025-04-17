import { IssueAccordion } from '@/components/issue/IssueAccordion'
import { Project } from '@/types/project'

interface ProjectIssuesListProps {
  project: Project
}

export default function ProjectIssuesList({ project }: ProjectIssuesListProps) {
  return (
    <div className="mt-10">
      <main className="container mx-auto">
        <IssueAccordion projectId={project.id} />
      </main>
    </div>
  )
}
