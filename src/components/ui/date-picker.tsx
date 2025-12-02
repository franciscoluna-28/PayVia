"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  buttonClassName?: string;
}

export function DatePicker({
  value,
  onChange,
  buttonClassName,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | null>(value || null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(value || null);
  }, [value]);

  const handleSelect = (selectedDay: Date) => {
    if (!selectedDay) return;

    const fixed = new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate()
    );
    onChange?.(fixed);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(`cursor-pointer`, buttonClassName)}
          variant="outline"
        >
          {date ? (
            <time>{date.toLocaleDateString()}</time>
          ) : (
            <span>Pick a date</span>
          )}

          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          captionLayout="dropdown"
          onSelect={handleSelect}
          required
        />
      </PopoverContent>
    </Popover>
  );
}
