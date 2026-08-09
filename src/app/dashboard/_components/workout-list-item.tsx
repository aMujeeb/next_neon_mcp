import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { MockWorkout } from "@/lib/mock-data"

function formatTimeRange(startAt: string, endAt: string | null) {
  const start = format(new Date(startAt), "HH:mm")
  if (!endAt) return `${start} – In progress`
  const end = format(new Date(endAt), "HH:mm")
  return `${start} – ${end}`
}

export function WorkoutListItem({ workout }: { workout: MockWorkout }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{workout.name ?? "Untitled workout"}</CardTitle>
        <CardDescription>
          {formatTimeRange(workout.performedStartAt, workout.performedEndAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {workout.notes ? (
          <p className="text-sm text-muted-foreground">{workout.notes}</p>
        ) : null}
        {workout.exercises.map((exercise, index) => (
          <div key={exercise.id} className="flex flex-col gap-2">
            {index > 0 ? <Separator /> : null}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{exercise.name}</span>
              {exercise.muscleGroup ? (
                <Badge variant="secondary">{exercise.muscleGroup}</Badge>
              ) : null}
              {exercise.equipment ? (
                <Badge variant="outline">{exercise.equipment}</Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exercise.sets.map((set) => (
                <Badge key={set.id} variant={set.isWarmup ? "outline" : "default"}>
                  {set.isWarmup ? "Warmup · " : ""}
                  {set.reps} × {set.weight}
                  {set.weightUnit}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
