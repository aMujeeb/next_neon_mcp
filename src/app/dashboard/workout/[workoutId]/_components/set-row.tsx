"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import type { SetDetail } from "@/data/workouts"
import { deleteSetAction, updateSetAction } from "../actions"

export function SetRow({
  workoutId,
  set,
}: {
  workoutId: string
  set: SetDetail
}) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [reps, setReps] = useState(String(set.reps))
  const [weight, setWeight] = useState(String(set.weight))
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">(set.weightUnit)
  const [isWarmup, setIsWarmup] = useState(set.isWarmup)
  const [notes, setNotes] = useState(set.notes ?? "")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSave(event: React.FormEvent) {
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
      const result = await updateSetAction({
        workoutId,
        setId: set.id,
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

      setIsEditing(false)
      router.refresh()
    })
  }

  function handleDelete() {
    if (!window.confirm("Delete this set?")) return
    setError(null)

    startTransition(async () => {
      const result = await deleteSetAction({ workoutId, setId: set.id })

      if (!result.success) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor={`edit-reps-${set.id}`}>Reps</Label>
            <Input
              id={`edit-reps-${set.id}`}
              type="number"
              min={1}
              className="w-20"
              value={reps}
              onChange={(event) => setReps(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`edit-weight-${set.id}`}>Weight</Label>
            <Input
              id={`edit-weight-${set.id}`}
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
              id={`edit-warmup-${set.id}`}
              checked={isWarmup}
              onCheckedChange={(checked) => setIsWarmup(checked === true)}
            />
            <Label htmlFor={`edit-warmup-${set.id}`}>Warmup</Label>
          </div>
          <Input
            placeholder="Notes (optional)"
            className="min-w-32 flex-1"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={500}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </form>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        <Badge variant={set.isWarmup ? "outline" : "default"}>
          {set.isWarmup ? "Warmup · " : ""}
          {set.reps} × {set.weight}
          {set.weightUnit}
        </Badge>
        {set.notes ? (
          <p className="text-sm text-muted-foreground">{set.notes}</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit set"
          disabled={isPending}
          onClick={() => setIsEditing(true)}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete set"
          disabled={isPending}
          onClick={handleDelete}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}
