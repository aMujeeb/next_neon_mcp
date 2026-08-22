import { notFound, redirect } from "next/navigation"

import { listExercises } from "@/data/exercises"
import { getWorkoutById } from "@/data/workouts"
import { isWorkoutEditable } from "@/lib/workout"
import { AddExerciseForm } from "./_components/add-exercise-form"
import { EditWorkoutForm } from "./_components/edit-workout-form"
import { WorkoutExerciseCard } from "./_components/workout-exercise-card"

export default async function EditWorkoutPage(
  props: PageProps<"/dashboard/workout/[workoutId]/edit">
) {
  const { workoutId } = await props.params

  const [workout, exercises] = await Promise.all([
    getWorkoutById(workoutId),
    listExercises(),
  ])
  if (!workout) {
    notFound()
  }

  if (!isWorkoutEditable(workout.performedStartAt)) {
    redirect(`/dashboard/workout/${workoutId}`)
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

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Exercises</h2>
        <AddExerciseForm workoutId={workout.id} exercises={exercises} />
        {workout.workoutExercises.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No exercises logged yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {workout.workoutExercises.map((workoutExercise) => (
              <WorkoutExerciseCard
                key={workoutExercise.id}
                workoutId={workout.id}
                workoutExercise={workoutExercise}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
