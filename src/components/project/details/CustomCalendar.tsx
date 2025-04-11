'use client'

import { useState } from 'react'
import { Issue, Project, statusColors } from '../project-type'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CustomCalendarProps {
  project: Project
  issues: Issue[]
  onDateSelect: (date: string) => void
}

export default function CustomCalendar({ project, issues, onDateSelect }: CustomCalendarProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string>(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
  )

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDay = new Date(year, month, 1).getDay()

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
    onDateSelect(dateStr)
  }

  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    if (index < startDay) {
      return <div key={index} className="h-32"></div>
    }
    const day = index - startDay + 1
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isSelected = selectedDate === dateStr
    const dateIssues = issues?.filter((issue) => String(issue.dueDate) === dateStr) || []

    const isStartDate = project.startDate && new Date(project.startDate).toISOString().split('T')[0] === dateStr
    const isCreatedDate = project.createdDate && new Date(project.createdDate).toISOString().split('T')[0] === dateStr
    const isDueDate = project.dueDate && new Date(project.dueDate).toISOString().split('T')[0] === dateStr
    const isEndDate = project.endDate && new Date(project.endDate).toISOString().split('T')[0] === dateStr

    return (
      <div
        key={index}
        className={`border p-2 rounded cursor-pointer ${isSelected ? 'bg-gray-200' : 'hover:bg-gray-100'} h-32 relative`}
        onClick={() => handleDateClick(day)}
      >
        <div className="flex items-start gap-1">
          <div className="font-bold">{day}</div>
          <div className="flex flex-wrap gap-0.5">
            {isStartDate && <div className="text-xs text-white bg-blue-500 px-1 py-0.5 rounded truncate max-w-[35px]">Start</div>}
            {isCreatedDate && <div className="text-xs text-white bg-green-500 px-1 py-0.5 rounded truncate max-w-[35px]">Created</div>}
            {isDueDate && <div className="text-xs text-white bg-yellow-500 px-1 py-0.5 rounded truncate max-w-[35px]">Due</div>}
            {isEndDate && <div className="text-xs text-white bg-red-500 px-1 py-0.5 rounded truncate max-w-[35px]">End</div>}
          </div>
        </div>
        <div className="mt-1 space-y-1">
          {dateIssues.slice(0, 3).map((issue) => (
            <div key={issue.id} className={`text-xs bg-blue-500 px-1 py-0.5 rounded truncate ${statusColors[issue.status]}`}>
              {issue.title}
            </div>
          ))}
          {dateIssues.length > 3 && <div className="text-xs bg-blue-500 px-1 py-0.5 rounded truncate">+{dateIssues.length - 3} more</div>}
        </div>
      </div>
    )
  })

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (month === 0) {
              setMonth(11)
              setYear(year - 1)
            } else {
              setMonth(month - 1)
            }
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-xl font-bold">{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (month === 11) {
              setMonth(0)
              setYear(year + 1)
            } else {
              setMonth(month + 1)
            }
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2 p-4 border rounded-xl w-full">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {calendarCells}
      </div>
    </>
  )
}
