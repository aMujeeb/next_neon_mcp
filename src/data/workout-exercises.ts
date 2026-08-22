import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import db from "@/db";
import { workoutExercises, workouts } from "@/db/schema";
import { requireUserId } from "@/data/auth";

export async function addExerciseToWorkout(input: {
  workoutId: string;
  exerciseId: string;
}) {
  const clerkUserId = await requireUserId();

  const workout = await db.query.workouts.findFirst({
    where: { id: input.workoutId, clerkUserId },
    with: { workoutExercises: { columns: { order: true } } },
  });

  if (!workout) return null;

  const nextOrder =
    workout.workoutExercises.reduce((max, we) => Math.max(max, we.order), 0) + 1;

  const [workoutExercise] = await db
    .insert(workoutExercises)
    .values({
      workoutId: input.workoutId,
      exerciseId: input.exerciseId,
      order: nextOrder,
    })
    .returning();

  return workoutExercise;
}

export async function removeExerciseFromWorkout(input: {
  workoutExerciseId: string;
}) {
  const clerkUserId = await requireUserId();

  const ownedWorkoutIds = db
    .select({ id: workouts.id })
    .from(workouts)
    .where(eq(workouts.clerkUserId, clerkUserId));

  const [deleted] = await db
    .delete(workoutExercises)
    .where(
      and(
        eq(workoutExercises.id, input.workoutExerciseId),
        inArray(workoutExercises.workoutId, ownedWorkoutIds)
      )
    )
    .returning();

  return deleted ?? null;
}
