'use client'

import React, { useState } from 'react'
import { ChevronUp, Plus } from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import { TooltipProvider } from '@/components/ui/tooltip'
import { IssueDetail } from './IssueDetail'
import { IssueInfo } from './IssueInfo'

import { cn } from '@/libs/utils'
import { ToggleIcon, getBgColor } from './icons'

import { Issue } from '@/types/issue'
import { useIssueStore } from '@/store/useIssueStore'
import { useIssue } from '@/hooks/useIssue'
import { IssueRef } from '@/types/project'

/**
 * 이슈 아코디언 컴포넌트
 * 프로젝트 ID를 받아 해당 프로젝트의 이슈 목록을 계층 구조로 표시
 * 이슈를 선택하면 오른쪽에 상세 정보를 표시
 */
export function IssueAccordion({ projectId }: { projectId: number }) {
  const { selectedIssue, setSelectedIssue, clearSelectedIssue } = useIssueStore()
  const { issues, isIssuesLoading } = useIssue(projectId)

  // 이슈 선택 핸들러
  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue)
  }

  if (isIssuesLoading) return <div className="text-center p-4">이슈 데이터를 불러오는 중...</div>
  if (!issues) return <div className="text-center p-4 text-destructive">이슈 데이터를 불러오는데 실패했습니다.</div>

  return (
    <TooltipProvider>
      <div className="w-full max-w-[95vw] mx-auto rounded-lg p-4 bg-background flex min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* 이슈 목록 영역 */}
        <div className={cn('transition-all duration-300 flex-1 overflow-auto', selectedIssue ? 'w-[45%] min-w-[500px] pr-4' : '')}>
          <div className="space-y-1">
            {issues.length > 0 ? (
              <Accordion type="multiple" className="w-full space-y-1">
                {issues.map((issue: Issue) => (
                  <div key={issue.id}>
                    <IssueNode key={issue.id} issue={issue} level={0} onSelectIssue={handleSelectIssue} />
                  </div>
                ))}
              </Accordion>
            ) : (
              <div className="text-center p-4 text-muted-foreground">이슈가 없습니다.</div>
            )}
          </div>
        </div>

        {/* 선택된 이슈 상세 정보 */}
        {selectedIssue && (
          <div className="w-1/2 pl-4 transition-all duration-300 overflow-auto">
            <IssueDetail issue={selectedIssue} projectId={projectId} onClose={clearSelectedIssue} onSelectIssue={handleSelectIssue} />
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

/**
 * 이슈를 계층 구조로 표시하는 이슈 노드 컴포넌트
 * 하위 이슈가 있는 경우 아코디언으로 표시하고, 없는 경우 단순 아이템으로 표시
 */
function IssueNode({ issue, level, onSelectIssue }: { issue: Issue | IssueRef; level: number; onSelectIssue: (issue: Issue) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = issue.subIssues && issue.subIssues.length > 0
  const { selectedIssue } = useIssueStore()

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const nodeStyle = {
    '--level': level,
  } as React.CSSProperties

  const nodeClass = cn(
    'flex items-center py-2 px-3 rounded-md transition-colors cursor-pointer h-10 group',
    'ml-[calc(var(--level)*1rem)]',
    getBgColor(issue.status),
    selectedIssue?.id === issue.id && 'border-2 border-primary',
  )

  if (!hasChildren) {
    return (
      <div className={nodeClass} style={nodeStyle}>
        <IssueInfo 
          issue={issue} 
          onClick={() => onSelectIssue(issue as Issue)} 
          hideStatus={!!selectedIssue}
        />
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible value={isOpen ? issue.id.toString() : ''} className="border-none">
      <AccordionItem value={issue.id.toString()} className="border-none">
        <div className={cn('ml-[calc(var(--level)*1rem)]')} style={nodeStyle}>
          <CustomAccordionTrigger
            className={cn(getBgColor(issue.status), 'w-full', selectedIssue?.id === issue.id && 'border-2 border-primary')}
            isOpen={isOpen}
            onClick={toggleAccordion}
            onSelectIssue={onSelectIssue}
            issue={issue as Issue}
          >
            <IssueInfo 
              issue={issue as Issue} 
              onClick={() => onSelectIssue(issue as Issue)} 
              hideStatus={!!selectedIssue}
            />
          </CustomAccordionTrigger>
        </div>
        <AccordionContent className="pt-1 pb-0 px-0 overflow-visible">
          {hasChildren && (
            <div className="space-y-1">
              {issue.subIssues!.map((child) => (
                <ChildIssueNode key={child.id} issueRef={child} level={level + 1} onSelectIssue={onSelectIssue} />
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function ChildIssueNode({ issueRef, level, onSelectIssue }: { issueRef: IssueRef; level: number; onSelectIssue: (issue: Issue) => void }) {
  const { issue: issueData, isIssueLoading } = useIssue(null, issueRef.id)

  if (isIssueLoading) return <div className="text-sm text-muted-foreground">Loading...</div>
  if (!issueData) return <div className="text-sm text-muted-foreground">Issue not found</div>

  return (
    <>
      <IssueNode key={issueData.id} issue={issueData} level={level + 1} onSelectIssue={onSelectIssue} />
    </>
  )
}

/**
 * 커스텀 아코디언 트리거 컴포넌트
 * 화살표 아이콘을 클릭했을 때만 아코디언이 토글되도록 한다.
 */
function CustomAccordionTrigger({
  children,
  className,
  isOpen,
  onClick,
  onSelectIssue,
  issue,
}: {
  children: React.ReactNode
  className?: string
  isOpen: boolean
  onClick: () => void
  onSelectIssue: (issue: Issue) => void
  issue: Issue
}) {
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  const handleIssueClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectIssue(issue)
  }

  return (
    <div className={cn('flex items-center gap-2 py-2 px-3 rounded-md transition-colors w-full h-10 group', className)}>
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground cursor-pointer"
        onClick={handleToggleClick}
      >
        {isOpen ? <ToggleIcon isOpen={true} /> : <ChevronUp className="h-4 w-4 transform rotate-180" />}
      </div>
      <div className="flex-1 cursor-pointer flex items-center" onClick={handleIssueClick}>
        {children}
      </div>
    </div>
  )
}
