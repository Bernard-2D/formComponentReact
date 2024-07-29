import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/css'
import { format } from 'date-fns'
import { CalendarIcon, XIcon } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { DateRange } from 'react-day-picker'

export default function DatePicker({
  className,
  setDate,
  date,
  placeholder = '开始时间 - 结束时间'
}: {
  className?: string
  setDate: Dispatch<SetStateAction<DateRange | undefined>>
  date?: DateRange
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('group relative grid gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-60 justify-start text-left font-normal text-inherit',
              !(date?.from && date.to) && 'text-slate-400'
            )}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-minor-3" />
            {date?.from && date.to ? (
              <>
                {format(date.from, 'yyyy-MM-dd')} ~ {format(date.to, 'yyyy-MM-dd')}
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div
        className="absolute right-2 top-3 h-4 w-4 cursor-pointer"
        onClick={() => {
          setDate(undefined)
        }}
      >
        <XIcon className={cn('absolute  h-full w-full opacity-0', date && 'group-hover:opacity-50')} />
      </div>
    </div>
  )
}
