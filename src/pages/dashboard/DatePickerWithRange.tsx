"use client"

import * as React from "react"
import {  format } from "date-fns"
//@ts-ignore
import { Calendar as CalendarIcon } from "lucide-react"
//@ts-ignore
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/custom/button"

// Modified DatePickerWithRange component
export function DatePickerWithRange({
  className,
  getLoans
}: React.HTMLAttributes<HTMLDivElement> & { getLoans: (filterDates?: {startDate: string, endDate: string}) => void }) {
  
  const [date, setDate] = React.useState<DateRange | undefined>(undefined)

  // Format the selected dates into the desired format
  const handleDateSelection = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);

    if (selectedDate?.from && selectedDate?.to) {
      const startDate = selectedDate.from.toISOString();
      const endDate = selectedDate.to.toISOString();

      // Call the getLoans function with the selected date range
      getLoans({
        startDate: startDate,
        endDate: endDate
      });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            //@ts-ignore
            variant={"default"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-slate-900"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Chagua Tarehe</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar           
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelection}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
