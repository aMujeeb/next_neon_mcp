"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addSetAction } from "../actions"

export function AddSetForm({
  workoutId,
  workoutExerciseId,
}: {
  workoutId: string
  workoutExerciseId: string
}) {
  const router = useRouter()
  const [reps, setReps] = useState("")
  const [weight, setWeight] = useState("")
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg")
  const [isWarmup, setIsWarmup] = useState(false)
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    const parsedReps = Number(reps)
    const parsedWeight = Number(weight)

    if (!reps || Number.isNaN(parsedReps)) {
      setError("Enter a valid rep count")
      return
    }
    if (!weight || Number.isNaN(parsedWeight)) {
      setError("Enter a valid weight")
      return
    }

    startTransition(async () => {
      const result = await addSetAction({
        workoutId,
        workoutExerciseId,
        reps: parsedReps,
        weight: parsedWeight,
        weightUnit,
        isWarmup,
        notes: notes || undefined,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      setReps("")
      setWeight("")
      setWeightUnit("kg")
      setIsWarmup(false)
      setNotes("")
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor={`reps-${workoutExerciseId}`}>Reps</Label>
          <Input
            id={`reps-${workoutExerciseId}`}
            type="number"
            min={1}
            className="w-20"
            value={reps}
            onChange={(event) => setReps(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`weight-${workoutExerciseId}`}>Weight</Label>
          <Input
            id={`weight-${workoutExerciseId}`}
            type="number"
            min={0}
            step="0.5"
            className="w-24"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
          />
        </div>
        <Select
          value={weightUnit}
          onValueChange={(value) => setWeightUnit(value as "kg" | "lb")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="lb">lb</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`warmup-${workoutExerciseId}`}
            checked={isWarmup}
            onCheckedChange={(checked) => setIsWarmup(checked === true)}
          />
          <Label htmlFor={`warmup-${workoutExerciseId}`}>Warmup</Label>
        </div>
        <Input
          placeholder="Notes (optional)"
          className="min-w-32 flex-1"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          maxLength={500}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding…" : "Add set"}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  )
}
