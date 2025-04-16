import { IssueAccordion } from '@/components/issue/IssueAccordion'
import { Project } from '@/types/project'

interface ProjectIssuesListProps {
  project: Project
}

export default function ProjectIssuesList({ project }: ProjectIssuesListProps) {
  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
      <main className="container mx-auto py-10 px-4">
        <IssueAccordion projectId={project.id} />
      </main>
    </div>
  )
}
