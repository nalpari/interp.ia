import { getUsers } from "@/api/user"
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CommandEmpty, CommandItem, CommandGroup } from "@/components/ui/command"
import { CommandInput } from "@/components/ui/command"
import { Command } from "@/components/ui/command"
import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/libs/utils"
import { Check } from "lucide-react"
import { useState } from "react"
import { Project } from "../../project-type"
import { updateProject } from "@/api/project"

export default function AssigneeDialog({ project, refetch }: { project: Project, refetch: () => void }  ) {
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

return(
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
)
}
