import { notFound } from "next/navigation"

import { getWorkoutById } from "@/data/workouts"
import { EditWorkoutForm } from "./_components/edit-workout-form"

export default async function EditWorkoutPage(
  props: PageProps<"/dashboard/workout/[workoutId]">
) {
  const { workoutId } = await props.params

  const workout = await getWorkoutById(workoutId)
  if (!workout) {
    notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold">Edit workout</h1>
        <p className="text-sm text-muted-foreground">
          Update this workout session.
        </p>
      </header>

      <EditWorkoutForm
        workoutId={workout.id}
        initialName={workout.name ?? ""}
        initialPerformedStartAt={workout.performedStartAt}
        initialNotes={workout.notes ?? ""}
      />
    </div>
  )
}
