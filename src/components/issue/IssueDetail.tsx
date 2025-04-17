'use client'

import React, { useState, useCallback } from 'react'
import { Plus, X, Edit2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon, CloseIcon } from './icons'
import { IssueInfo } from './IssueInfo'
import { IssueBadge } from './IssueBadge'

import { cn } from '@/libs/utils'
import { useIssue } from '@/hooks/useIssue'
import { useIssueStore } from '@/store/useIssueStore'
import { Issue, IssueType, UserType } from '@/types/issue'
import { IssueRef } from '@/types/project'

const formatDateToYYYYMMDD = (date: Date | null) => {
  if (!date) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateDisplay = (dateString: string | null | Date) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatDateTime = (dateString: string | null | Date) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 날짜 포맷팅 유틸리티 함수
function EditableDate({ label, date, onDateChange }: { label: string; date: Date | null; onDateChange: (date: Date | null) => void }) {
  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date || null)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {CalendarIcon}
        <span className="font-medium">{label}:</span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn('ml-2 text-left font-normal', !date && 'text-muted-foreground')}>
            {formatDateDisplay(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar mode="single" selected={date ? new Date(date) : undefined} onSelect={handleDateSelect} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// 텍스트 편집 컴포넌트
function EditableText({
  value,
  placeholder,
  onChange,
  isMultiline = false,
}: {
  value: string | null
  placeholder: string
  onChange: (newValue: string) => void
  isMultiline?: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleEdit = () => {
    setEditValue(value)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editValue !== value) {
      onChange(editValue || '')
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isMultiline && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <Textarea
          value={editValue || ''}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder={placeholder}
          className={cn('resize-none', isMultiline ? 'min-h-[100px]' : 'min-h-[32px]')}
          rows={isMultiline ? 4 : 1}
          autoFocus
        />
      </div>
    )
  }

  return (
    <div
      className={cn('group relative p-2 rounded-md hover:bg-muted/50 cursor-text', isMultiline ? 'min-h-[60px]' : 'min-h-[32px]')}
      onClick={handleEdit}
    >
      {value ? (
        <div className={cn(isMultiline && 'whitespace-pre-wrap')}>{value}</div>
      ) : (
        <div className="text-muted-foreground italic">{placeholder}</div>
      )}
      <Edit2 className="absolute right-2 top-2 h-3 w-3 opacity-0 group-hover:opacity-100" />
    </div>
  )
}

// 태그 입력 컴포넌트
function TagInput({ tags, onTagsChange }: { tags: string[]; onTagsChange: (tags: string[]) => void }) {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = () => {
    if (inputValue.trim()) {
      const newTags = [...tags, inputValue.trim()]
      onTagsChange(newTags)
      setInputValue('')
    }
  }

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    onTagsChange(newTags)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <div className="text-sm text-muted-foreground italic">Not set</div>
        ) : (
          tags.map((tag: string, index: number) => (
            <Badge key={index} className="px-2 py-1 flex items-center gap-1" variant="secondary">
              {tag}
              <Button type="button" variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => handleRemoveTag(index)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        )}
      </div>
      <div className="flex items-center">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add tag..."
          className="text-sm"
          onKeyDown={handleKeyDown}
        />
        <Button type="button" size="icon" variant="ghost" className="ml-2" onClick={handleAddTag} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function AssigneeSelector({ assignees, onAssigneesChange }: { assignees: UserType[]; onAssigneesChange: (assignees: UserType[]) => void }) {
  const handleRemoveAssignee = (userId: number) => {
    const newAssignees = assignees.filter((user) => user.id !== userId)
    onAssigneesChange(newAssignees)
  }

  return (
    <div className="space-y-2">
      {assignees.length === 0 ? (
        <div className="text-sm text-muted-foreground italic">Not set</div>
      ) : (
        <div className="space-y-2">
          {assignees.map((user) => (
            <div key={user.id} className="flex items-center justify-between group">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={user.image || `/placeholder.svg?height=32&width=32&text=${user.name.substring(0, 2)}`} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
              <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveAssignee(user.id)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 이슈 날짜 필드 컴포넌트
function IssueDateFields({ issue, onUpdate }: { issue: Issue; onUpdate: (field: keyof Issue, value: any) => void }) {
  return (
    <div className="space-y-2 pt-2 border-t border-muted">
      <EditableDate label="시작일" date={issue.startDate} onDateChange={(date) => onUpdate('startDate', formatDateToYYYYMMDD(date))} />
      <EditableDate label="기한일" date={issue.dueDate} onDateChange={(date) => onUpdate('dueDate', formatDateToYYYYMMDD(date))} />
      <EditableDate label="종료일" date={issue.endDate} onDateChange={(date) => onUpdate('endDate', formatDateToYYYYMMDD(date))} />
    </div>
  )
}

// 이슈 메타 정보 컴포넌트
function IssueMetaInfo({ issue }: { issue: Issue }) {
  return (
    <>
      <div className="flex items-center text-xs mb-2">
        {CalendarIcon}
        <span className="font-medium">생성일 :</span>
        <span className="ml-2">{formatDateTime(issue.createdDate)}</span>
      </div>

      <div className="flex items-center text-xs mb-2">
        {CalendarIcon}
        <span className="font-medium">수정일 :</span>
        <span className="ml-2">{formatDateTime(issue.updatedDate)}</span>
      </div>
    </>
  )
}

// 이슈 작성자 컴포넌트
function IssueCreator({ creator }: { creator: UserType }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">작성자</h3>
      <div className="flex items-center">
        <Avatar className="h-6 w-6 mr-2">
          <AvatarImage src={creator.image || `/placeholder.svg?height=32&width=32&text=${creator.name.substring(0, 2)}`} alt={creator.name} />
          <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <span>{creator.name}</span>
      </div>
    </div>
  )
}

// 이슈 담당자 컴포넌트
function IssueAssignees({ assignees, onUpdate }: { assignees: UserType[] | null; onUpdate: (field: keyof Issue, value: any) => void }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">담당자</h3>
      <AssigneeSelector assignees={assignees || []} onAssigneesChange={(value) => onUpdate('assignee', value)} />
    </div>
  )
}

// 이슈 설명 컴포넌트
function IssueDescription({ description, onUpdate }: { description: string | null; onUpdate: (field: keyof Issue, value: any) => void }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">설명</h3>
      <EditableText value={description || ''} placeholder="설명을 입력해주세요" onChange={(value) => onUpdate('description', value)} isMultiline />
    </div>
  )
}

// 이슈 태그 컴포넌트
function IssueTags({ tags, onUpdate }: { tags: string[]; onUpdate: (field: keyof Issue, value: any) => void }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">태그</h3>
      <TagInput tags={Array.isArray(tags) ? tags.map((tag) => String(tag)) : []} onTagsChange={(value) => onUpdate('tag', value)} />
    </div>
  )
}

// 이슈 타입, 상태, 우선순위 컴포넌트
function IssueBadges({ issue, onUpdate }: { issue: Issue; onUpdate: (field: keyof Issue, value: any) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <IssueBadge type="type" value={issue.type} onChange={(value) => onUpdate('type', value)} />
      <IssueBadge type="status" value={issue.status} onChange={(value) => onUpdate('status', value)} />
      <IssueBadge type="priority" value={issue.priority} onChange={(value) => onUpdate('priority', value)} />
    </div>
  )
}

function IssueRefInfo({ issueRef, onSelectIssue }: { issueRef: IssueRef; onSelectIssue: (issue: Issue) => void }) {
  const { issue: issueData, isIssueLoading } = useIssue(null, issueRef.id)

  const handleClick = () => {
    if (issueData) {
      onSelectIssue(issueData)
    }
  }

  if (isIssueLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>
  }

  if (!issueData) {
    return <div className="text-sm text-muted-foreground">Issue not found</div>
  }

  return (
    <div className="cursor-pointer hover:bg-muted/50" onClick={handleClick}>
      <IssueInfo issue={issueData} />
    </div>
  )
}

// 이슈 관계 컴포넌트
function IssueRelations({ issue, onSelectIssue }: { issue: Issue; onSelectIssue: (issue: Issue) => void }) {
  return (
    <>
      {/* 상위 프로젝트 */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium">상위 프로젝트</h3>
        {issue.parentProject ? (
          <div
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSelectIssue({ ...issue.parentProject, type: IssueType.PROJECT } as unknown as Issue)}
          >
            <IssueInfo issue={{ ...issue.parentProject, type: IssueType.PROJECT } as unknown as Issue} />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">Not set</div>
        )}
      </div>

      {/* 상위 이슈 */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium">상위 이슈</h3>
        {issue.parentIssue ? (
          <IssueRefInfo issueRef={issue.parentIssue} onSelectIssue={onSelectIssue} />
        ) : (
          <div className="text-sm text-muted-foreground italic">Not set</div>
        )}
      </div>

      {/* 하위 이슈 */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium">하위 이슈</h3>
        {issue.subIssues && issue.subIssues.length > 0 ? (
          <div className="space-y-1">
            {issue.subIssues.map((subIssue) => (
              <IssueRefInfo key={subIssue.id} issueRef={subIssue} onSelectIssue={onSelectIssue} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">Not set</div>
        )}
      </div>

      {/* 관련 이슈 */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium">관련 이슈</h3>
        {issue.relatedIssues && issue.relatedIssues.length > 0 ? (
          <div className="space-y-1">
            {issue.relatedIssues.map((relatedIssue) => (
              <IssueRefInfo key={relatedIssue.id} issueRef={relatedIssue} onSelectIssue={onSelectIssue} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">Not set</div>
        )}
      </div>
    </>
  )
}

export function IssueDetail({
  issue,
  projectId,
  onClose,
  onSelectIssue,
}: {
  issue: Issue
  projectId?: number
  onClose: () => void
  onSelectIssue: (issue: Issue) => void
}) {
  const { setSelectedIssue, updateIssueField } = useIssueStore()
  const { updateIssue } = useIssue(projectId, issue.id)

  // 이슈 필드 변경 감지 및 업데이트
  const checkIssueUpdate = useCallback(
    (field: keyof Issue, value: any) => {
      if (issue[field] === value) return
      updateIssue(
        { issueId: issue.id, field, value },
        {
          onSuccess: () => {
            updateIssueField(issue.id, field, value)
          },
          onError: (error: Error) => {
            console.error('이슈 업데이트 중 오류 발생:', error)
          },
        },
      )
    },
    [issue, updateIssue, updateIssueField],
  )

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-1 text-sm">
              #{issue.id}
            </Badge>
            <EditableText value={issue.title || ''} placeholder="제목을 입력해주세요" onChange={(value) => checkIssueUpdate('title', value)} />
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <EditableText
              value={issue.subTitle || ''}
              placeholder="부제목을 입력해주세요"
              onChange={(value) => checkIssueUpdate('subTitle', value)}
            />
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          {CloseIcon}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 이슈 상태 */}
          <IssueBadges issue={issue} onUpdate={checkIssueUpdate} />

          {/* 이슈 태그 */}
          <IssueTags tags={issue.tag} onUpdate={checkIssueUpdate} />

          {/* 이슈 메타 정보 */}
          <IssueMetaInfo issue={issue} />

          {/* 이슈 날짜 필드 */}
          <IssueDateFields issue={issue} onUpdate={checkIssueUpdate} />

          {/* 이슈 작성자 */}
          <IssueCreator creator={issue.creator} />

          {/* 이슈 담당자 */}
          <IssueAssignees assignees={issue.assignee} onUpdate={checkIssueUpdate} />

          {/* 이슈 설명 */}
          <IssueDescription description={issue.description} onUpdate={checkIssueUpdate} />

          {/* 이슈 관계 */}
          <IssueRelations issue={issue} onSelectIssue={onSelectIssue} />
        </div>
      </CardContent>
    </Card>
  )
}
