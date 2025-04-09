import CreateButton from '@/components/project/create/CreateButton'
import ProjectList from '@/components/project/ProjectList'

export default function ProjectsPage() {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <CreateButton />
      </div>
      <main className="container mx-auto p-4">
        <ProjectList />
      </main>
    </div>
  )
}
