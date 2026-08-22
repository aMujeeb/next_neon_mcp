"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Exercise } from "@/data/exercises"
import { addExerciseAction } from "../actions"

export function AddExerciseForm({
  workoutId,
  exercises,
}: {
  workoutId: string
  exercises: Exercise[]
}) {
  const router = useRouter()
  const [exerciseId, setExerciseId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (!exerciseId) {
      setError("Select an exercise")
      return
    }

    startTransition(async () => {
      const result = await addExerciseAction({ workoutId, exerciseId })

      if (!result.success) {
        setError(result.error)
        return
      }

      setExerciseId(null)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Select value={exerciseId} onValueChange={setExerciseId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an exercise">
              {(value: string | null) =>
                exercises.find((exercise) => exercise.id === value)?.name
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {exercises.map((exercise) => (
              <SelectItem key={exercise.id} value={exercise.id}>
                {exercise.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding…" : "Add"}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  )
}
