'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Project } from '@/components/project/project-type'
import { deleteProject, getProject } from '@/api/project'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import ProjectIssuesList from './ProjectIssuesList'
import ProjectBoard from './ProjectBoard'
import ProjectOverview from './ProjectOverview'
import { Badge } from '@/components/ui/badge'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/useUserStore'
import ProjectCalendar from './ProjectCalendar'

export default function ProjectHeader() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const loginedUserInfo = useUserStore((state) => state.loginedUserInfo)
  const {
    data: project,
    isLoading,
    refetch,
  } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => getProject(id as string),
    staleTime: 0,
  })
  const [tab, setTab] = useState('overview')
  const router = useRouter()


  if (isLoading) {
    return <div>Loading...</div>
  }

  const handleDeleteProject = async () => {
    await deleteProject(Number(id))
    queryClient.invalidateQueries({ queryKey: ['project-list'] })
    router.push('/dashboard/projects')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">{project?.title}</h1>
          <Badge variant="default" className="ml-3">
            {project?.type}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {loginedUserInfo?.id === project?.creator.id && (
            <Button variant="destructive" onClick={handleDeleteProject}>
              <Trash /> Delete
            </Button>
          )}
        </div>
      </div>
      <div>
        <Tabs value={tab} onValueChange={setTab} className="w-full h-auto">
          <TabsList className="flex w-2/3 h-13">
            <TabsTrigger value="overview" className="flex-1 text-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="list" className="flex-1 text-lg">
              List
            </TabsTrigger>
            <TabsTrigger value="board" className="flex-1 text-lg">
              Board
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1 text-lg">
              Calendar
            </TabsTrigger>
          </TabsList>
          {project && (
            <>
              <TabsContent value="overview">
                <ProjectOverview project={project} refetch={refetch} />
              </TabsContent>
              <TabsContent value="list">
                <ProjectIssuesList project={project} />
              </TabsContent>
              <TabsContent value="board">
                <ProjectBoard project={project} />
              </TabsContent>
              <TabsContent value="calendar">
                <ProjectCalendar project={project} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  )
}
