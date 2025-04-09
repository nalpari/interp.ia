'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

import { useState } from 'react'

import { createProject } from '@/api/project'

import { useQueryClient } from '@tanstack/react-query'
import { ProjectForm } from './ProjectForm'
import { useProjectFormStore } from '@/store/useProjectFormStore'

export default function CreateButton() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { form, reset } = useProjectFormStore()

  const handleSubmit = async () => {
    try {
      const projectRequest = {
        ...form,
      }

      console.log('🚀 ~ handleSubmit ~ projectRequest:', projectRequest)
      await createProject(projectRequest)

      await queryClient.invalidateQueries({ queryKey: ['project-list'] })
      reset()
      setOpen(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" />
          Create project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New project</DialogTitle>
        </DialogHeader>
        <ProjectForm />
        <DialogFooter>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
