'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/libs/utils'
import { Project, ProjectRequest } from "@/types/project";
import { IssueStatus, IssuePriority as Priority } from '@/types/issue'
import { DateFields } from './DateFields'
import { AssigneeSelect } from '../list/AssigneeSelect'
import { useDebounce } from '@/hooks/useDebounce'
import { DialogFooter } from '@/components/ui/dialog'

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

export function ProjectForm({
  project,
  updateProjectMutation,
  onSubmit,
}: {
  project?: Project | null
  updateProjectMutation?: (request: { id: number; key: string; value: object | string }) => void
  onSubmit?: (formData: ProjectRequest) => void
}) {
  const [form, setForm] = useState<ProjectRequest>(project ? {
    title: project.title,
    subTitle: project.subTitle,
    description: project.description,
    status: project.status,
    priority: project.priority,
    assigneeId: project.assignee.map((user) => user.id),
    dueDate: project.dueDate ? (typeof project.dueDate === 'string' ? project.dueDate : project.dueDate.toISOString()) : '',
    startDate: project.startDate ? (typeof project.startDate === 'string' ? project.startDate : project.startDate.toISOString()) : '',
    endDate: project.endDate ? (typeof project.endDate === 'string' ? project.endDate : project.endDate.toISOString()) : '',
    tag: project.tag,
    subIssuesId: project.subIssues.map((issue) => issue.id)
  } : initialFormData)
  const [currentTag, setCurrentTag] = useState('')

  const debouncedUpdate = useDebounce((key: string, value: any) => {
    if (project?.id) {
      handleUpdate(key, value)
    }
  }, 500)

  const handleUpdate = async (key: string, value: any) => {
    if (project?.id && updateProjectMutation) {
      try {
        await updateProjectMutation({ id: project.id, key, value })
      } catch (error) {
        console.error('Failed to update project:', error)
        alert('프로젝트 업데이트에 실패했습니다. 다시 시도해주세요.')
        setForm(prev => ({
          ...prev,
          [key]: project[key as keyof Project]
        }))
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setForm((prev) => {
      const newForm = {
        ...prev,
        tag: prev.tag.filter((tag) => tag !== tagToRemove),
      }
      if (project?.id) {
        handleUpdate('tag', newForm.tag)
      }
      return newForm
    })
  }

  const setField = <K extends keyof ProjectRequest>(field: K, value: ProjectRequest[K]) => {
    setForm(prev => {
      const newForm = {
        ...prev,
        [field]: value
      }
      if (project?.id) {
        if (field === 'title' && (!value || (typeof value === 'string' && value.trim() === ''))) {
          alert('제목을 입력해주세요.')
          return prev
        }
        if (['title', 'subTitle', 'description'].includes(field)) {
          debouncedUpdate(field, value)
        } else {
          handleUpdate(field, value)
        }
      }
      return newForm
    })
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title<span className="text-red-500">*</span>
        </Label>
        <div className="col-span-3">
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Title (필수)"
            required
            aria-required="true"
            className={cn('w-full', !form.title && 'border-red-500 focus-visible:ring-red-500')}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="subTitle" className="text-right">
          SubTitle
        </Label>
        <div className="col-span-3">
          <Input id="subTitle" value={form.subTitle} onChange={(e) => setField('subTitle', e.target.value)} placeholder="SubTitle" />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <div className="col-span-3">
          <Textarea id="description" value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Description" />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="assignee" className="text-right font-medium">
          담당자
        </Label>
        <div className="col-span-3">
          <AssigneeSelect selectedIds={form.assigneeId} onSelect={(ids) => setField('assigneeId', ids)} className="flex-1" />
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
        </div>
      </div>
      {!project && (
        <DialogFooter>
          <Button 
            onClick={() => onSubmit?.(form)}
            disabled={!form.title.trim()}
          >
            Create
          </Button>
        </DialogFooter>
      )}
    </div>
  )
}
