import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getWorkoutById } from "@/data/workouts"
import { isWorkoutEditable } from "@/lib/workout"

function formatTimeRange(startAt: Date, endAt: Date | null) {
  const start = format(startAt, "HH:mm")
  if (!endAt) return `${start} – In progress`
  const end = format(endAt, "HH:mm")
  return `${start} – ${end}`
}

export default async function WorkoutDetailPage(
  props: PageProps<"/dashboard/workout/[workoutId]">
) {
  const { workoutId } = await props.params

  const workout = await getWorkoutById(workoutId)
  if (!workout) {
    notFound()
  }

  const canEdit = isWorkoutEditable(workout.performedStartAt)

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 sm:p-6">
      <Button
        variant="ghost"
        className="w-fit"
        nativeButton={false}
        render={
          <Link
            href={`/dashboard?date=${format(workout.performedStartAt, "yyyy-MM-dd")}`}
          />
        }
      >
        <ArrowLeft />
        Back
      </Button>

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {workout.name ?? "Untitled workout"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {format(workout.performedStartAt, "yyyy-MM-dd")} ·{" "}
            {formatTimeRange(workout.performedStartAt, workout.performedEndAt)}
          </p>
        </div>
        {canEdit ? (
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/dashboard/workout/${workout.id}/edit`} />}
          >
            <Pencil />
            Edit
          </Button>
        ) : null}
      </header>

      {workout.notes ? (
        <p className="text-sm text-muted-foreground">{workout.notes}</p>
      ) : null}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Exercises</h2>
        {workout.workoutExercises.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No exercises logged for this workout.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {workout.workoutExercises.map((workoutExercise) => (
              <Card key={workoutExercise.id}>
                <CardHeader>
                  <CardTitle>{workoutExercise.exercise.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
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
                  {workoutExercise.notes ? (
                    <p className="text-sm text-muted-foreground">
                      {workoutExercise.notes}
                    </p>
                  ) : null}
                  {workoutExercise.sets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No sets logged yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {workoutExercise.sets.map((set) => (
                        <Badge
                          key={set.id}
                          variant={set.isWarmup ? "outline" : "default"}
                        >
                          {set.isWarmup ? "Warmup · " : ""}
                          {set.reps} × {set.weight}
                          {set.weightUnit}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
