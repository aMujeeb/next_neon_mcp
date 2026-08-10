import { format } from "date-fns"
import { Dumbbell } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getWorkoutsForDate } from "@/data/workouts"
import { DatePicker } from "./_components/date-picker"
import { WorkoutListItem } from "./_components/workout-list-item"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const selectedDate = date ? new Date(`${date}T00:00:00`) : new Date()

  const workouts = await getWorkoutsForDate(selectedDate)

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track your workouts by day.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr] md:items-start">
        <DatePicker selectedDate={selectedDate} />

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">
            Workouts for {format(selectedDate, "yyyy-MM-dd")}
          </h2>
          <Separator />
          <ScrollArea className="max-h-144">
            <div className="flex flex-col gap-4 pr-4">
              {workouts.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                    <Dumbbell className="size-6" />
                    No workouts logged for this date.
                  </CardContent>
                </Card>
              ) : (
                workouts.map((workout) => (
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
