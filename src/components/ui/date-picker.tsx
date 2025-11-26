"use client"
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | null>(value || null)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setDate(value || null)
  }, [value])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      onChange?.(selectedDate)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="invisible" className="w-32 justify-between font-normal bg-transparent">
          {date ? date.toLocaleDateString() : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar mode="single" selected={date || undefined} captionLayout="dropdown" onSelect={handleDateSelect} />
      </PopoverContent>
    </Popover>
  )
}
