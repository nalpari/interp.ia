'use client'

import { Project } from '@/components/project/project-type'
import ExpandingCard from '../ExpandingCard'

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (projectId: number) => void;
  isLoading?: boolean;
}

export function ProjectGrid({ projects, onProjectClick, isLoading }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">No projects found</div>
      </div>
    )
  }

  console.log('🚀 ~ ProjectGrid ~ projects:', projects)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project: Project) => (
        <div key={project.id} onClick={() => onProjectClick(project.id)} className="cursor-pointer">
          <ExpandingCard title={project.title} description={project.description} image={null} type={project.type} status={project.status} />
        </div>
      ))}
    </div>
  )
} 