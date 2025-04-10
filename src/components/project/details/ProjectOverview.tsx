import { updateProject } from '@/api/project'
import { Project } from '@/components/project/project-type'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Check, Users } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/libs/utils'
import { Button } from '@/components/ui/button'
import { getUsers } from '@/api/user'

interface ProjectOverviewProps {
  project: Project
  refetch: () => void
}

export default function ProjectOverview({ project, refetch }: ProjectOverviewProps) {
  const [assigneeIds, setAssigneeIds] = useState<number[]>(project?.assignee?.map((a) => a.id) || [])
  const [users, setUsers] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  const getUsersForAsignee = async () => {
    const users = await getUsers(null)
    setUsers(users.data)
  }

  const handleUpdateAssignee = async () => {
    try {
      await updateProject(project.id, 'assigneeId', assigneeIds)
      refetch()
      setOpen(false)
    } catch (error) {
      console.error('Failed to update assignees:', error)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4 mt-10">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50" onClick={getUsersForAsignee}>
            <CardHeader className="text-lg font-bold">Assignee</CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {project?.assignee?.map((assignee) => (
                  <div key={assignee.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">{assignee.name?.[0]?.toUpperCase()}</div>
                    <div className="flex flex-col">
                      <span className="font-medium">{assignee.name}</span>
                      <span className="text-sm text-gray-500">{assignee.email}</span>
                    </div>
                  </div>
                ))}
              </div>
              <span className="text-lg font-bold mb-2">Creator</span>
              <div className="flex items-center gap-2 mt-7">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">{project?.creator?.name?.[0]?.toUpperCase()}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{project?.creator?.name}</span>
                  <span className="text-sm text-gray-500">{project?.creator?.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>담당자 수정</DialogTitle>
          </DialogHeader>
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="담당자 검색..." />
            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    const isSelected = assigneeIds.includes(user.id)
                    if (isSelected) {
                      setAssigneeIds(assigneeIds.filter((id) => id !== user.id))
                    } else {
                      setAssigneeIds([...assigneeIds, user.id])
                    }
                  }}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      assigneeIds.includes(user.id) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible',
                    )}
                  >
                    <Check className={cn('h-4 w-4')} />
                  </div>
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setAssigneeIds(project?.assignee?.map((a) => a.id) || [])
                setOpen(false)
              }}
            >
              취소
            </Button>
            <Button onClick={handleUpdateAssignee}>저장</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Card>
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
      <Card>
        <CardHeader className="text-lg font-bold">Tags</CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {project?.tag?.map((tag, index) => (
              <Badge key={index} variant="outline" className="mr-2">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="text-lg font-bold">Info</CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li key="description">
              <span className="text-sm">Description:</span>
              <span className="text-sm text-gray-500 ml-2">{project?.description}</span>
            </li>
            <li key="status">
              <span className="text-sm">Status:</span>
              <span className="text-sm text-gray-500 ml-2">{project?.status}</span>
            </li>
            <li key="priority">
              <span className="text-sm">Priority:</span>
              <span className="text-sm text-gray-500 ml-2">{project?.priority}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
