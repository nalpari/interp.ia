'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil, Plus } from 'lucide-react'

import { useState } from 'react'

import { createProject as createProjectApi, updateProject as updateProjectApi } from '@/api/project'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useProjectFormStore } from '@/store/useProjectFormStore'
import { Project } from '../project-type'
import { ProjectForm } from './ProjectForm'

interface CreateButtonProps {
  project?: Project | null
  refetch?: () => Promise<any>
}

export default function CreateButton({ project, refetch }: CreateButtonProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { form, reset } = useProjectFormStore()

  const {
    mutate: createProjectMutation,
    isPending,
  } = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['project', 'list'] })
      // refetch vs invalidateQ
      // refetch < windowOnfocus
      setOpen(false)
    }
  })

  // windowOnFocus - 리렌더링 
  const {
    mutate: updateProjectMutation,
  } = useMutation({
    mutationFn: updateProjectApi,
    onSuccess: async () => {
      if (refetch) {
        await refetch()
      } else {
        queryClient.invalidateQueries({ queryKey: ['project', project?.id] })
      }
    }
  })

  const handleSubmit = async () => {
    if(form.title.trim() === '' || form.assigneeId.length === 0) {
      alert
      return
    }
    try {
      const projectRequest = {
        ...form,
      }
      await createProjectMutation(projectRequest)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) reset()
    else if (project) reset(project)
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
        <ProjectForm project={project} updateProjectMutation={updateProjectMutation} />
        {!project && (
          <DialogFooter>
            <Button onClick={handleSubmit}
            disabled={form.title.trim() === '' || form.assigneeId.length === 0}
            >Create</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
