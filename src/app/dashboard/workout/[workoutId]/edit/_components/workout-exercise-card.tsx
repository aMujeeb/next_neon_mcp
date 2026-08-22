"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { WorkoutExerciseDetail } from "@/data/workouts"
import { removeExerciseAction } from "../actions"
import { AddSetForm } from "./add-set-form"
import { SetRow } from "./set-row"

export function WorkoutExerciseCard({
  workoutId,
  workoutExercise,
}: {
  workoutId: string
  workoutExercise: WorkoutExerciseDetail
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleRemove() {
    if (!window.confirm("Remove this exercise and all its sets?")) return
    setError(null)

    startTransition(async () => {
      const result = await removeExerciseAction({
        workoutId,
        workoutExerciseId: workoutExercise.id,
      })

      if (!result.success) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{workoutExercise.exercise.name}</CardTitle>
        <CardAction>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove exercise"
            disabled={isPending}
            onClick={handleRemove}
          >
            <Trash2 />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {workoutExercise.exercise.muscleGroup ? (
            <Badge variant="secondary">{workoutExercise.exercise.muscleGroup}</Badge>
          ) : null}
          {workoutExercise.exercise.equipment ? (
            <Badge variant="outline">{workoutExercise.exercise.equipment}</Badge>
          ) : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {workoutExercise.sets.length > 0 ? (
          <div className="flex flex-col gap-3">
            {workoutExercise.sets.map((set) => (
              <SetRow key={set.id} workoutId={workoutId} set={set} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No sets logged yet.</p>
        )}

        <Separator />

        <AddSetForm workoutId={workoutId} workoutExerciseId={workoutExercise.id} />
      </CardContent>
    </Card>
  )
}
