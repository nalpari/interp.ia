import { Project } from '@/components/project/project-type'
import AssigneeDialog from './update-dialog/AssigneeDialog'
import DateDialog from './update-dialog/DateDialog'
import TagDialog from './update-dialog/TagDialog'
import InfoDialog from './update-dialog/InfoDialog'
interface ProjectOverviewProps {
  project: Project
  refetch: () => void
}

export default function ProjectOverview({ project, refetch }: ProjectOverviewProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mt-10">
      <AssigneeDialog project={project} refetch={refetch} />
      <DateDialog project={project} refetch={refetch} />
      <TagDialog project={project} refetch={refetch} />
      <InfoDialog project={project} refetch={refetch} />
    </div>
  )
}
