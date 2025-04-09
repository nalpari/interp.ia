'use client'

import { ProjectListRequest, IssueStatus, Priority } from '@/components/project/project-type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/libs/utils'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'

interface ProjectFiltersProps {
  request: ProjectListRequest
  onFilterChange: (key: keyof ProjectListRequest, value: any) => void
}

interface DateFilterProps {
  label: string
  fromDate: string | null
  toDate: string | null
  onFromChange: (date: string | null) => void
  onToChange: (date: string | null) => void
  isStartEndPair?: boolean
}

function DateFilter({ label, fromDate, toDate, onFromChange, onToChange }: DateFilterProps) {
  const handleDateChange = (type: 'from' | 'to', date: Date | undefined) => {
    if (!date) return
    const formattedDate = format(date, 'yyyy-MM-dd')

    if (type === 'from') {
      if (!toDate) {
        alert(`${label}의 종료일자도 입력해 주세요.`)
      }
      onFromChange(formattedDate)
    } else {
      if (!fromDate) {
        alert(`${label}의 시작일자도 입력해 주세요.`)
      }
      onToChange(formattedDate)
    }
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className={cn('flex-1 justify-start text-left font-normal', !fromDate && 'text-muted-foreground')}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="min-w-[55px]">{label}</span>
            <span className="ml-2">{fromDate || '시작일자'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={fromDate ? new Date(fromDate) : undefined}
            onSelect={(date) => handleDateChange('from', date)}
            initialFocus
            disabled={(date) => (toDate ? date > new Date(toDate) : false)}
          />
        </PopoverContent>
      </Popover>

      <span className="flex items-center">~</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className={cn('flex-1 justify-start text-left font-normal', !toDate && 'text-muted-foreground')}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {toDate || '종료일자'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={toDate ? new Date(toDate) : undefined}
            onSelect={(date) => handleDateChange('to', date)}
            initialFocus
            disabled={(date) => (fromDate ? date < new Date(fromDate) : false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function ProjectFilters({ request, onFilterChange }: ProjectFiltersProps) {
  const handleReset = () => {
    onFilterChange('status', null)
    onFilterChange('priority', null)
    onFilterChange('title', null)
    onFilterChange('subTitle', null)
    onFilterChange('createdDateFrom', null)
    onFilterChange('createdDateTo', null)
    onFilterChange('updatedDateFrom', null)
    onFilterChange('updatedDateTo', null)
    onFilterChange('dueDateFrom', null)
    onFilterChange('dueDateTo', null)
    onFilterChange('startDateFrom', null)
    onFilterChange('startDateTo', null)
    onFilterChange('endDateFrom', null)
    onFilterChange('endDateTo', null)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Select 
          value={request.status === null ? "" : request.status}
          onValueChange={(value) => onFilterChange('status', value as IssueStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODO">할 일</SelectItem>
            <SelectItem value="IN_PROGRESS">진행중</SelectItem>
            <SelectItem value="DONE">완료</SelectItem>
            <SelectItem value="CANCELLED">취소됨</SelectItem>
            <SelectItem value="ANALYSIS">분석중</SelectItem>
            <SelectItem value="UNPRODUCIBLE">재현불가</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={request.priority === null ? "" : request.priority}
          onValueChange={(value) => onFilterChange('priority', value as Priority)}
        >
          <SelectTrigger>
            <SelectValue placeholder="중요도" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="EMERGENCY">긴급</SelectItem>
            <SelectItem value="HIGH">높음</SelectItem>
            <SelectItem value="MEDIUM">중간</SelectItem>
            <SelectItem value="LOW">낮음</SelectItem>
          </SelectContent>
        </Select>

        <Input 
          value={request.title || ''}
          placeholder="제목" 
          onChange={(e) => onFilterChange('title', e.target.value)} 
        />

        <Input 
          value={request.subTitle || ''}
          placeholder="부제목" 
          onChange={(e) => onFilterChange('subTitle', e.target.value)} 
        />
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
        <div className="flex justify-end">
          <Button variant="default" onClick={handleReset}>
            검색조건 초기화
          </Button>
        </div>
      </div>
    </div>
  )
}
