import React from 'react'
import {
  AlertCircle,
  Bug,
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  Flag,
  HelpCircle,
  Layers,
  LayoutList,
  MoreHorizontal,
  Pause,
  Play,
  Star,
  X,
  CheckCircle,
} from 'lucide-react'

import { cn } from '@/libs/utils'

import { IssuePriority, IssueStatus, IssueType } from '@/types/issue'

/**
 * 아이콘 스타일 인터페이스
 */
interface IconStyle {
  icon: React.ReactElement<{ className?: string }>
  color: string
  bgColor: string
  textColor: string
}

/**
 * 기본 아이콘 스타일
 */
const defaultIconStyle: IconStyle = {
  icon: <HelpCircle className="h-4 w-4" />,
  color: 'text-gray-500',
  bgColor: 'bg-gray-100',
  textColor: 'text-gray-500',
}

/**
 * 이슈 타입에 따른 스타일 반환
 */
export function getTypeStyle(type: string): IconStyle {
  switch (type) {
    case IssueType.PROJECT:
      return {
        icon: <Layers className="h-4 w-4" />,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-700',
      }
    case IssueType.EPIC:
      return {
        icon: <Layers className="h-4 w-4" />,
        color: 'text-purple-500',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
      }
    case IssueType.STORY:
      return {
        icon: <FileText className="h-4 w-4" />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
      }
    case IssueType.TASK:
      return {
        icon: <FileText className="h-4 w-4" />,
        color: 'text-green-500',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
      }
    case IssueType.BUG:
      return {
        icon: <Bug className="h-4 w-4" />,
        color: 'text-red-500',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
      }
    case IssueType.SUB_TASK:
      return {
        icon: <LayoutList className="h-4 w-4" />,
        color: 'text-teal-500',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-700',
      }
    default:
      return defaultIconStyle
  }
}

/**
 * 이슈 상태에 따른 스타일 반환
 */
export function getStatusStyle(status: string | null): IconStyle {
  if (!status) {
    return defaultIconStyle
  }

  switch (status) {
    case IssueStatus.TODO:
      return {
        icon: <Clock className="h-3 w-3" />,
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
      }
    case IssueStatus.IN_PROGRESS:
      return {
        icon: <Play className="h-3 w-3" />,
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
      }
    case IssueStatus.DONE:
      return {
        icon: <CheckCircle className="h-3 w-3" />,
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
      }
    case IssueStatus.CANCELED:
      return {
        icon: <Pause className="h-3 w-3" />,
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
      }
    case IssueStatus.ANALYSIS:
      return {
        icon: <AlertCircle className="h-3 w-3" />,
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
      }
    case IssueStatus.UNPRODUCIBLE:
      return {
        icon: <HelpCircle className="h-3 w-3" />,
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
      }
    default:
      return defaultIconStyle
  }
}

/**
 * 이슈 우선순위에 따른 스타일 반환
 */
export function getPriorityStyle(priority: string | null): IconStyle {
  if (!priority) {
    return defaultIconStyle
  }

  switch (priority) {
    case IssuePriority.EMERGENCY:
      return {
        icon: <Flag className="h-3 w-3" />,
        color: 'text-white',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
      }
    case IssuePriority.HIGH:
      return {
        icon: <Star className="h-3 w-3" />,
        color: 'text-white',
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
      }
    case IssuePriority.MEDIUM:
      return {
        icon: <Star className="h-3 w-3" />,
        color: 'text-white',
        bgColor: 'bg-yellow-500',
        textColor: 'text-white',
      }
    case IssuePriority.LOW:
      return {
        icon: <Star className="h-3 w-3" />,
        color: 'text-white',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
      }
    default:
      return defaultIconStyle
  }
}

/**
 * 이슈 타입에 따른 아이콘 반환
 */
export function getTypeIcon(type: string) {
  const style = getTypeStyle(type)
  const iconWithColor = React.cloneElement(style.icon, {
    className: cn(style.icon.props.className, style.color),
  })
  return {
    icon: iconWithColor,
    color: style.color,
  }
}

/**
 * 상태 아이콘 상수
 */
export const StatusIcons = {
  TODO: <Clock className="h-3 w-3" />,
  IN_PROGRESS: <Play className="h-3 w-3" />,
  DONE: <CheckCircle className="h-3 w-3" />,
  CANCELED: <Pause className="h-3 w-3" />,
  ANALYSIS: <AlertCircle className="h-3 w-3" />,
  UNPRODUCIBLE: <HelpCircle className="h-3 w-3" />,
  DEFAULT: <HelpCircle className="h-3 w-3" />,
}

/**
 * 우선순위 아이콘 상수
 */
export const PriorityIcons = {
  EMERGENCY: <Flag className="h-3 w-3" />,
  HIGH: <Star className="h-3 w-3" />,
  MEDIUM: <Star className="h-3 w-3" />,
  LOW: <Star className="h-3 w-3" />,
  DEFAULT: <HelpCircle className="h-3 w-3" />,
}

/**
 * 공통 아이콘 상수
 */
export const CalendarIcon = <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
export const MoreIcon = <MoreHorizontal className="h-3 w-3" />
export const CloseIcon = <X className="h-4 w-4" />

/**
 * 토글 아이콘 컴포넌트
 */
export function ToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <ChevronDown
      className={cn('h-4 w-4 transition-transform duration-200', {
        'transform rotate-180': isOpen,
      })}
    />
  )
}

/**
 * 이슈 상태에 따른 배경색 반환
 */
export const getBgColor = (status: string | null) => {
  const style = getStatusStyle(status)
  return `hover:${style.bgColor} ${style.bgColor.replace('bg-', 'bg-opacity-50 bg-')}`
}
