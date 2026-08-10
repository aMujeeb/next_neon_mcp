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
import type { WorkoutWithDetails } from "@/data/workouts"

function formatTimeRange(startAt: Date, endAt: Date | null) {
  const start = format(startAt, "HH:mm")
  if (!endAt) return `${start} – In progress`
  const end = format(endAt, "HH:mm")
  return `${start} – ${end}`
}

export function WorkoutListItem({ workout }: { workout: WorkoutWithDetails }) {
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
        {workout.workoutExercises.map((workoutExercise, index) => (
          <div key={workoutExercise.id} className="flex flex-col gap-2">
            {index > 0 ? <Separator /> : null}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">
                {workoutExercise.exercise.name}
              </span>
              {workoutExercise.exercise.muscleGroup ? (
                <Badge variant="secondary">
                  {workoutExercise.exercise.muscleGroup}
                </Badge>
              ) : null}
              {workoutExercise.exercise.equipment ? (
                <Badge variant="outline">
                  {workoutExercise.exercise.equipment}
                </Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {workoutExercise.sets.map((set) => (
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
