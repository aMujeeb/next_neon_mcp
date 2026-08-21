"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { updateWorkoutAction } from "../actions"

export function EditWorkoutForm({
  workoutId,
  initialName,
  initialPerformedStartAt,
  initialNotes,
}: {
  workoutId: string
  initialName: string
  initialPerformedStartAt: Date
  initialNotes: string
}) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [performedStartAt, setPerformedStartAt] = useState<Date>(
    initialPerformedStartAt
  )
  const [notes, setNotes] = useState(initialNotes)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await updateWorkoutAction({
        workoutId,
        name: name || undefined,
        performedStartAt,
        notes: notes || undefined,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      router.push(`/dashboard?date=${format(result.performedStartAt, "yyyy-MM-dd")}`)
    })
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="workout-name">Name</Label>
            <Input
              id="workout-name"
              placeholder="e.g. Push day"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger
                render={<Button type="button" variant="outline" className="w-full justify-start" />}
              >
                <CalendarIcon />
                {format(performedStartAt, "yyyy-MM-dd")}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={performedStartAt}
                  onSelect={(date) => {
                    if (!date) return
                    setPerformedStartAt(date)
                    setIsDatePickerOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="workout-notes">Notes</Label>
            <Textarea
              id="workout-notes"
              placeholder="Optional notes about this workout"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={2000}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
