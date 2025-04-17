'use client'

import React from 'react'

import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { IssueBadge } from './IssueBadge'
import { MoreIcon } from './icons'

import { cn } from '@/libs/utils'

import { Issue, UserType } from '@/types/issue'
import { IssueRef } from '@/types/project'

/**
 * 담당자 아바타 컴포넌트
 * 최대 3명의 담당자 아바타를 표시하고, 그 이상인 경우 +N 형태로 표시
 */
function Assignees({ users }: { users: UserType[] }) {
  if (users.length === 0) {
    return <div className="text-sm text-muted-foreground italic">Not set</div>
  }

  const displayCount = 3
  const hasMore = users.length > displayCount
  const displayUsers = users.slice(0, displayCount)
  const remainingCount = users.length - displayCount

  return (
    <div className="flex items-center gap-1">
      {displayUsers.map((user) => (
        <Tooltip key={user.id}>
          <TooltipTrigger asChild>
            <Avatar className="h-6 w-6 border border-background">
              <AvatarImage src={user.image || `/placeholder.svg?height=32&width=32&text=${user.name.substring(0, 2)}`} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}

      {hasMore && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">{MoreIcon}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>+{remainingCount} more assignees</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

/**
 * 이슈 컴포넌트
 */
export function IssueInfo({ issue, className, onClick }: { issue: Issue | IssueRef; className?: string; onClick?: () => void }) {
  return (
    <div className={cn('flex items-center w-full h-10', className)} onClick={onClick}>
      <IssueBadge type="type" value={issue.type} />
      <Badge variant="outline" className="mr-2 px-1 text-xs">
        #{issue.id}
      </Badge>
      <span className="mr-auto truncate" title={issue.title}>
        {issue.title}
      </span>
      <div className="flex items-center gap-2 ml-4">
        <Assignees users={issue.assignee || []} />
      </div>
      <div className="flex items-center gap-2 ml-4">
        <IssueBadge type="priority" value={issue.priority} />
        <IssueBadge type="status" value={issue.status} />
      </div>
    </div>
  )
}
