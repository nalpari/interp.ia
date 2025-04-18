'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { createProject as createProjectApi } from '@/api/project'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ProjectForm } from './ProjectForm'
import { ProjectRequest, Project } from '@/types/project'

const initialFormData: ProjectRequest = {
  title: '',
  subTitle: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  assigneeId: [],
  dueDate: '',
  startDate: '',
  endDate: '',
  tag: [],
  subIssuesId: [],
}

interface CreateButtonProps {
  project?: Project | null
  updateProjectMutation?: (request: { id: number; key: string; value: object | string }) => void
}

export default function CreateButton({ project, updateProjectMutation }: CreateButtonProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: createProjectMutation, isPending } = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      // project 목록 조회 무효화
      queryClient.invalidateQueries({ queryKey: ['project', 'list'] })
      // history 조회 무효화
      queryClient.invalidateQueries({ queryKey: ['history'] })
      queryClient.invalidateQueries({ queryKey: ['childHistory'] })
      setOpen(false)
    },
  })

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
  }

  const handleSubmit = async (formData: ProjectRequest) => {
    if (formData.title.trim() === '') {
      alert('제목을 입력해주세요.')
      return
    }
    try {
      await createProjectMutation(formData)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isPending}>
          {project ? (
            <>
              <Pencil className="mr-2" />
              Edit project
            </>
          ) : (
            <>
              <Plus className="mr-2" />
              Create project
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? 'Edit' : 'Create New'} project</DialogTitle>
        </DialogHeader>
        <ProjectForm project={project} updateProjectMutation={updateProjectMutation} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
