import { Project } from '@/components/project/project-type'
import AssigneeDialog from './update-dialog/AssigneeDialog'
import DateDialog from './update-dialog/DateDialog'
import TagDialog from './update-dialog/TagDialog'
import InfoDialog from './update-dialog/InfoDialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject as updateProjectApi } from '@/api/project'
interface ProjectOverviewProps {
  project: Project
  refetch: () => void
}

export default function ProjectOverview({ project, refetch }: ProjectOverviewProps) {
  const queryClient = useQueryClient()

  const { mutate: updateProjectMutation, isPending } = useMutation({
    mutationFn: updateProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] })
      refetch()
    },
    onError: (error) => {
      console.error('Failed to update project:', error)
    },
  })

  return (
    <div className="grid grid-cols-4 gap-4 mt-10">
      <AssigneeDialog project={project} updateProjectMutation={updateProjectMutation} />
      <DateDialog project={project} updateProjectMutation={updateProjectMutation} />
      <TagDialog project={project} updateProjectMutation={updateProjectMutation} />
      <InfoDialog project={project} updateProjectMutation={updateProjectMutation} />
    </div>
  )
}
