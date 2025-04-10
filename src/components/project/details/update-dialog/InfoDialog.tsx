'use client'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { IssueStatus, Priority, Project } from '../../project-type'
import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { updateProject } from '@/api/project'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function InfoDialog({ project, refetch }: { project: Project; refetch: () => void }) {
  const [title, setTitle] = useState(project?.title)
  const [subTitle, setSubTitle] = useState(project?.subTitle)
  const [description, setDescription] = useState(project?.description)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardHeader className="text-lg font-bold">Info</CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li key="subTitle">
                <span className="text-sm">Sub Title:</span>
                <span className="text-sm text-gray-500 ml-2">{project?.subTitle}</span>
              </li>
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상태 수정</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          <span>Title</span>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button
            onClick={() => {
              updateProject(project?.id, 'title', title)
              refetch()
            }}
          >
            저장
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <span>Sub Title</span>
          <Input value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
          <Button
            onClick={() => {
              updateProject(project?.id, 'subTitle', subTitle)
              refetch()
            }}
          >
            저장
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <span>Description</span>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button
            onClick={() => {
              updateProject(project?.id, 'description', description)
              refetch()
            }}
          >
            저장
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <span>Status</span>
          <Select
            value={project?.status}
            onValueChange={(value) => {
              updateProject(project?.id, 'status', value as IssueStatus)
              refetch()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              {['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED', 'ANALYSIS', 'UNPRODUCIBLE'].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <span>Priority</span>
          <Select
            value={project?.priority}
            onValueChange={(value) => {
              updateProject(project?.id, 'priority', value as Priority)
              refetch()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="우선순위 선택" />
            </SelectTrigger>
            <SelectContent>
              {['EMERGENCY', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  )
}
