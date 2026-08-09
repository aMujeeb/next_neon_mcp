"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Dumbbell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { mockWorkouts } from "@/lib/mock-data"
import { WorkoutListItem } from "./_components/workout-list-item"

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd")
  const workoutsForSelectedDate = mockWorkouts.filter(
    (workout) =>
      format(new Date(workout.performedStartAt), "yyyy-MM-dd") ===
      selectedDateKey
  )

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track your workouts by day.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr] md:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Select a date</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
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
                    setSelectedDate(date)
                    setIsDatePickerOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">
            Workouts for {format(selectedDate, "yyyy-MM-dd")}
          </h2>
          <Separator />
          <ScrollArea className="max-h-[36rem]">
            <div className="flex flex-col gap-4 pr-4">
              {workoutsForSelectedDate.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                    <Dumbbell className="size-6" />
                    No workouts logged for this date.
                  </CardContent>
                </Card>
              ) : (
                workoutsForSelectedDate.map((workout) => (
                  <WorkoutListItem key={workout.id} workout={workout} />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
