import { NewWorkoutForm } from "./_components/new-workout-form"

export default function NewWorkoutPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold">Log workout</h1>
        <p className="text-sm text-muted-foreground">
          Record a new workout session.
        </p>
      </header>

      <NewWorkoutForm />
    </div>
  )
}
