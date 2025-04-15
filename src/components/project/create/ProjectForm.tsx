'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProjectFormStore } from '@/store/useProjectFormStore'
import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/libs/utils'
import { Priority, IssueStatus, Project } from '@/components/project/project-type'
import { DateFields } from './DateFields'
import { AssigneeSelect } from '../list/AssigneeSelect'

export function ProjectForm({
  project,
  updateProjectMutation,
}: {
  project?: Project | null
  updateProjectMutation: (request: { id: number; key: string; value: object | string }) => void
}) {
  const { form, setField } = useProjectFormStore()
  const [currentTag, setCurrentTag] = useState('')

  const handleUpdate = async (key: string, value: any) => {
    if (project?.id) {
      try {
        await updateProjectMutation({ id: project.id, key, value })
      } catch (error) {
        console.error(error)
      }
      alert('저장되었습니다.')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setField(
      'tag',
      form.tag.filter((tag) => tag !== tagToRemove),
    )
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title<span className="text-red-500">*</span>
        </Label>
        <div className="col-span-3 flex gap-2">
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Title (필수)"
            required
            aria-required="true"
            className={cn('w-full', !form.title && 'border-red-500 focus-visible:ring-red-500')}
          />
          {project && (
            <Button size="sm" onClick={() => handleUpdate('title', form.title)} disabled={!form.title}>
              Save
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="subTitle" className="text-right">
          SubTitle
        </Label>
        <div className="col-span-3 flex gap-2">
          <Input id="subTitle" value={form.subTitle} onChange={(e) => setField('subTitle', e.target.value)} placeholder="SubTitle" />
          {project && (
            <Button size="sm" onClick={() => handleUpdate('subTitle', form.subTitle)}>
              Save
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <div className="col-span-3 flex gap-2">
          <Textarea id="description" value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Description" />
          {project && (
            <Button size="sm" onClick={() => handleUpdate('description', form.description)}>
              Save
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="assignee" className="text-right font-medium">
          담당자 <span className="text-red-500">*</span>
        </Label>
        <div className="col-span-3 flex gap-2">
          <AssigneeSelect
            selectedIds={form.assigneeId}
            onSelect={(ids) => (project ? handleUpdate('assigneeId', ids) : setField('assigneeId', ids))}
            required
            className="flex-1"
          />
          {project && (
            <Button size="sm" onClick={() => handleUpdate('assigneeId', form.assigneeId)}>
              Save
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="status" className="w-20 text-right font-medium">
            Status
          </Label>
          <Select
            value={project ? project.status : form.status}
            onValueChange={(value) => {
              project ? handleUpdate('status', value as IssueStatus) : setField('status', value as IssueStatus)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">할 일</SelectItem>
              <SelectItem value="IN_PROGRESS">진행중</SelectItem>
              <SelectItem value="DONE">완료</SelectItem>
              <SelectItem value="CANCELED">취소됨</SelectItem>
              <SelectItem value="ANALYSIS">분석중</SelectItem>
              <SelectItem value="UNPRODUCIBLE">재현불가</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="priority" className="w-20 text-right font-medium">
            Priority
          </Label>
          <Select
            value={project ? project.priority : form.priority}
            onValueChange={(value) => {
              project ? handleUpdate('priority', value as Priority) : setField('priority', value as Priority)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="우선순위 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EMERGENCY">긴급</SelectItem>
              <SelectItem value="HIGH">높음</SelectItem>
              <SelectItem value="MEDIUM">중간</SelectItem>
              <SelectItem value="LOW">낮음</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DateFields project={project} form={form} onUpdate={handleUpdate} onFieldChange={setField} />
      <div className="grid grid-cols-6 items-center gap-4">
        <Label htmlFor="tags" className="text-right">
          Tags
        </Label>
        <div className="col-span-5 flex flex-wrap gap-1 border rounded-md px-3 py-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring">
          {form.tag.map((tag) => (
            <Badge key={tag} variant="secondary" className="h-6 bg-muted hover:bg-muted-foreground/20">
              {tag}
              <button type="button" className="ml-1 hover:text-destructive" onClick={() => removeTag(tag)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            type="text"
            className="flex-1 min-w-[120px] outline-none bg-transparent"
            placeholder={form.tag.length === 0 ? '태그 입력 후 Enter' : ''}
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && currentTag.trim()) {
                e.preventDefault()
                if (!form.tag.includes(currentTag.trim())) {
                  setField('tag', [...form.tag, currentTag.trim()])
                }
                setCurrentTag('')
              } else if (e.key === 'Backspace' && !currentTag && form.tag.length > 0) {
                setField('tag', form.tag.slice(0, -1))
              }
            }}
          />
          {project && (
            <Button size="sm" onClick={() => handleUpdate('tag', form.tag)} className="ml-2">
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
