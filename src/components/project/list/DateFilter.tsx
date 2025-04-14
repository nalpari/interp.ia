import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/libs/utils"

interface DateFilterProps {
    label: string
    fromDate: string | null
    toDate: string | null
    onFromChange: (date: string | null) => void
    onToChange: (date: string | null) => void
    isStartEndPair?: boolean
  }
  
  export default function DateFilter({ label, fromDate, toDate, onFromChange, onToChange }: DateFilterProps) {
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