'use client'

import { ProjectListRequest, IssueStatus, Priority, statusLabels, priorityLabels } from '@/components/project/project-type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AssigneeSelect } from './AssigneeSelect'
import DateFilter from './DateFilter'
import { useProjectListStore } from '@/store/useProjectListStore'

interface ProjectFiltersProps {
  request: ProjectListRequest
  onFilterChange: (key: keyof ProjectListRequest, value: any) => void
  onMyAssigneeChange: (value: boolean) => void
}

export default function ProjectFilters({ request, onFilterChange, onMyAssigneeChange }: ProjectFiltersProps) {
  const { reset } = useProjectListStore()
  const handleReset = () => {
    reset()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Select value={request.status === null ? '' : request.status} onValueChange={(value) => onFilterChange('status', value as IssueStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={request.priority === null ? '' : request.priority} onValueChange={(value) => onFilterChange('priority', value as Priority)}>
          <SelectTrigger>
            <SelectValue placeholder="중요도" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {Object.entries(priorityLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input value={request.title || ''} placeholder="제목" onChange={(e) => onFilterChange('title', e.target.value)} />

        <Input value={request.subTitle || ''} placeholder="부제목" onChange={(e) => onFilterChange('subTitle', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateFilter
          label="생성일"
          fromDate={request.createdDateFrom}
          toDate={request.createdDateTo}
          onFromChange={(date) => onFilterChange('createdDateFrom', date)}
          onToChange={(date) => onFilterChange('createdDateTo', date)}
        />
        <DateFilter
          label="수정일"
          fromDate={request.updatedDateFrom}
          toDate={request.updatedDateTo}
          onFromChange={(date) => onFilterChange('updatedDateFrom', date)}
          onToChange={(date) => onFilterChange('updatedDateTo', date)}
        />

        <DateFilter
          label="마감일"
          fromDate={request.dueDateFrom}
          toDate={request.dueDateTo}
          onFromChange={(date) => onFilterChange('dueDateFrom', date)}
          onToChange={(date) => onFilterChange('dueDateTo', date)}
        />

        <DateFilter
          label="시작일"
          fromDate={request.startDateFrom}
          toDate={request.startDateTo}
          onFromChange={(date) => onFilterChange('startDateFrom', date)}
          onToChange={(date) => onFilterChange('startDateTo', date)}
        />

        <DateFilter
          label="종료일"
          fromDate={request.endDateFrom}
          toDate={request.endDateTo}
          onFromChange={(date) => onFilterChange('endDateFrom', date)}
          onToChange={(date) => onFilterChange('endDateTo', date)}
        />
        <div className="flex gap-2">
          <AssigneeSelect selectedIds={request.assigneeId || []} onSelect={(ids) => onFilterChange('assigneeId', ids || [])} type="multiple" />
          <AssigneeSelect
            selectedIds={request.creatorId ? [request.creatorId] : []}
            onSelect={(ids) => onFilterChange('creatorId', ids?.[0] || null)}
            type="single"
            placeholder="생성자 선택"
            searchPlaceholder="생성자 검색..."
          />
        </div>
      </div>
      <div className="flex justify-end items-center gap-2">
        <label className="text-sm font-medium">
          <input type="checkbox" className="mr-2 items-center" onChange={(e) => onMyAssigneeChange(e.target.checked)} />
          할당된 프로젝트만 조회
        </label>
        <Button variant="default" onClick={handleReset}>
          검색조건 초기화
        </Button>
      </div>
    </div>
  )
}
