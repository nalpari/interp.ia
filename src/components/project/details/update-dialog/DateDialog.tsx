'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Project } from '../../project-type'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Popover } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { updateProject } from '@/api/project'
import { useState } from 'react'

export default function DateDialog({ project, updateProjectMutation }: { project: Project, updateProjectMutation: (request: {id: number, key: string, value: object | string}) => void }) {
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false)
  const [isDueDatePopoverOpen, setIsDueDatePopoverOpen] = useState(false)
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false)

  const handleUpdateDate = async (date: Date | undefined, key: string, closePopover: () => void) => {
    try {
      await updateProjectMutation({id: project?.id, key: key, value: date ? format(date, 'yyyy-MM-dd') : ''})
      closePopover()
    } catch (error) {
      console.error('Error updating date:', error)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardHeader className="text-lg font-bold">Date</CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ul>
                <li>
                  <Badge variant="outline" className="mr-2">
                    Created At
                  </Badge>
                  <span className="text-sm text-gray-500">{new Date(project?.createdDate || '').toLocaleDateString()}</span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    Updated At
                  </Badge>
                  <span className="text-sm text-gray-500">{new Date(project?.updatedDate || '').toLocaleDateString()}</span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    Due Date
                  </Badge>
                  <span className="text-sm text-gray-500">{new Date(project?.dueDate || '').toLocaleDateString()}</span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    End Date
                  </Badge>
                  <span className="text-sm text-gray-500">{new Date(project?.endDate || '').toLocaleDateString()}</span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    Start Date
                  </Badge>
                  <span className="text-sm text-gray-500">{new Date(project?.startDate || '').toLocaleDateString()}</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>날짜 수정</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-4'>
            <span>Start Date</span>
            <div>
                <Popover open={isStartDatePopoverOpen} onOpenChange={setIsStartDatePopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !project?.startDate && 'text-muted-foreground')}>
                             {project?.startDate ? format(new Date(project?.startDate), 'yyyy-MM-dd') : '날짜 선택'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={project?.startDate ? new Date(project?.startDate) : undefined}
                            onSelect={(date) => {
                              handleUpdateDate(date, 'startDate', () => setIsStartDatePopoverOpen(false))
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
            <span>Due Date</span>
            <div>
                <Popover open={isDueDatePopoverOpen} onOpenChange={setIsDueDatePopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !project?.dueDate && 'text-muted-foreground')}>
                             {project?.dueDate ? format(new Date(project?.dueDate), 'yyyy-MM-dd') : '날짜 선택'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={project?.dueDate ? new Date(project?.dueDate) : undefined}
                            onSelect={(date) => {
                              handleUpdateDate(date, 'dueDate', () => setIsDueDatePopoverOpen(false))
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
            <span>End Date</span>
            <div>
                <Popover open={isEndDatePopoverOpen} onOpenChange={setIsEndDatePopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !project?.endDate && 'text-muted-foreground')}>
                             {project?.endDate ? format(new Date(project?.endDate), 'yyyy-MM-dd') : '날짜 선택'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={project?.endDate ? new Date(project?.endDate) : undefined}
                            onSelect={(date) => {
                              handleUpdateDate(date, 'endDate', () => setIsEndDatePopoverOpen(false))
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
