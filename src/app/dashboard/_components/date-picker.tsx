"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ selectedDate }: { selectedDate: Date }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a date</CardTitle>
      </CardHeader>
      <CardContent>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger
            render={<Button variant="outline" className="w-full justify-start" />}
          >
            <CalendarIcon />
            {format(selectedDate, "yyyy-MM-dd")}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (!date) return
                router.push(`${pathname}?date=${format(date, "yyyy-MM-dd")}`)
                setIsOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  )
}
