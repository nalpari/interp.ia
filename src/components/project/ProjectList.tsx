'use client'

import { getProjects } from '@/api/project'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Project, ProjectListRequest } from '@/components/project/project-type'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import { ProjectFilters } from './ProjectFilters'
import { ProjectGrid } from './ProjectGrid'

const initialRequest: ProjectListRequest = {
  assigneeId: null,
  status: null,
  priority: null,
  title: null,
  subTitle: null,
  creatorId: null,
  createdDateFrom: null,
  createdDateTo: null,
  updatedDateFrom: null,
  updatedDateTo: null,
  dueDateFrom: null,
  dueDateTo: null,
  startDateFrom: null,
  startDateTo: null,
  endDateFrom: null,
  endDateTo: null,
}

export default function ProjectList() {
  const loginedUserInfo = useUserStore((state) => state.loginedUserInfo)
  const [request, setRequest] = useState<ProjectListRequest>(initialRequest)
  const router = useRouter()

  useEffect(() => {
    if (loginedUserInfo?.id) {
      setRequest((prev) => ({
        ...prev,
        assigneeId: [loginedUserInfo.id],
      }))
    }
  }, [loginedUserInfo?.id])

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['project-list', request],
    queryFn: async () => {
      const data = await getProjects(request)
      return data
    },
    staleTime: 0,
  })

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  const handleFilterChange = (key: keyof ProjectListRequest, value: any) => {
    const newValue = value === "all" ? null : value;
    
    setRequest(prev => {
      const newRequest = {
        ...prev,
        [key]: newValue
      };
      return newRequest;
    });
  }

  return (
    <div className="space-y-6">
      <ProjectFilters 
        request={request}
        onFilterChange={handleFilterChange}
      />
      <ProjectGrid 
        projects={projects || []}
        onProjectClick={handleProjectClick}
        isLoading={isLoading}
      />
    </div>
  )
}
