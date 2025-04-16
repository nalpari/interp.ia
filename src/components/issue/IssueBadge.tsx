'use client'

import React from 'react'

import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { getTypeStyle, getStatusStyle, getPriorityStyle } from './icons'

import { IssuePriority, IssueStatus, IssueType } from '@/types/issue'

type BadgeType = 'type' | 'status' | 'priority'

interface IssueBadgeProps {
  type: BadgeType
  value: string | null
  onChange?: (value: string | null) => void
}

/**
 * 이슈 뱃지 컴포넌트
 * 이슈의 타입, 상태, 우선순위를 표시하고 변경할 수 있는 컴포넌트
 */
export function IssueBadge({ type, value, onChange }: IssueBadgeProps) {
  // 옵션 목록 가져오기
  const getOptions = () => {
    switch (type) {
      case 'type':
        return Object.values(IssueType)
      case 'status':
        return Object.values(IssueStatus)
      case 'priority':
        return Object.values(IssuePriority)
      default:
        return []
    }
  }

  // 스타일 가져오기
  const getStyle = () => {
    switch (type) {
      case 'type':
        return getTypeStyle(value as IssueType)
      case 'status':
        return getStatusStyle(value as IssueStatus)
      case 'priority':
        return getPriorityStyle(value as IssuePriority)
      default:
        return {
          icon: null,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-500',
        }
    }
  }

  // 라벨 텍스트 가져오기
  const getLabel = () => {
    if (!value) return 'Not set'
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' ')
  }

  // 뱃지 렌더링
  const renderBadge = () => {
    const style = getStyle()
    const label = getLabel()

    return (
      <Badge
        variant={type === 'type' ? 'outline' : undefined}
        className={`${type === 'type' ? 'bg-white' : style.bgColor} ${style.textColor} flex items-center gap-1`}
      >
        {style.icon}
        {label}
      </Badge>
    )
  }

  // 읽기 전용 모드
  if (!onChange) {
    return renderBadge()
  }

  // 편집 가능 모드
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">{renderBadge()}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {getOptions().map((option) => (
          <DropdownMenuItem key={option} onClick={() => onChange(option)} className="cursor-pointer">
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
