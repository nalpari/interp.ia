'use client'

import { getProjects } from '@/api/project'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Project, ProjectListRequest } from '@/components/project/project-type'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import { ProjectGrid } from './ProjectGrid'
import ProjectFilters from './ProjectFilters'
import { useProjectListStore } from '@/store/useProjectListStore'

// 프로젝트 목록 컴포넌트
export default function ProjectList() {
  const loginedUserInfo = useUserStore((state) => state.loginedUserInfo)
  const { request, setFilter, reset } = useProjectListStore()
  const router = useRouter()

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['project', 'list', request],
    queryFn: async () => {
      const data = await getProjects(request)
      return data
    },
    staleTime: 0,
    gcTime: 0,
  })

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  const handleFilterChange = (key: keyof ProjectListRequest, value: any) => {
    if (key === 'assigneeId') {
      setFilter(key, value)
    } else {
      const newValue = value === 'all' ? null : value
      setFilter(key, newValue)
    }
  }

  const handleMyAssigneeChange = (value: boolean) => {
    if (value) {
      setFilter('assigneeId', [loginedUserInfo?.id])
    } else {
      setFilter('assigneeId', null)
    }
  }

  return (
    <div className="space-y-6">
      <ProjectFilters 
        request={request} 
        onFilterChange={handleFilterChange} 
        onMyAssigneeChange={handleMyAssigneeChange}
      />
      <ProjectGrid 
        projects={projects || []} 
        onProjectClick={handleProjectClick} 
        isLoading={isLoading} 
      />
    </div>
  )
}
