import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import db from "@/db";
import { sets, workoutExercises, workouts } from "@/db/schema";
import { requireUserId } from "@/data/auth";

type SetFields = {
  reps: number;
  weight: number;
  weightUnit: "kg" | "lb";
  isWarmup?: boolean;
  notes?: string;
};

function ownedWorkoutExerciseIds(clerkUserId: string) {
  return db
    .select({ id: workoutExercises.id })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workoutExercises.workoutId, workouts.id))
    .where(eq(workouts.clerkUserId, clerkUserId));
}

export async function addSet(input: SetFields & { workoutExerciseId: string }) {
  const clerkUserId = await requireUserId();

  const workoutExercise = await db.query.workoutExercises.findFirst({
    where: { id: input.workoutExerciseId, workout: { clerkUserId } },
    with: { sets: { columns: { setNumber: true } } },
  });

  if (!workoutExercise) return null;

  const nextSetNumber =
    workoutExercise.sets.reduce((max, s) => Math.max(max, s.setNumber), 0) + 1;

  const [set] = await db
    .insert(sets)
    .values({
      workoutExerciseId: input.workoutExerciseId,
      setNumber: nextSetNumber,
      reps: input.reps,
      weight: input.weight,
      weightUnit: input.weightUnit,
      isWarmup: input.isWarmup ?? false,
      notes: input.notes,
    })
    .returning();

  return set;
}

export async function updateSet(input: SetFields & { setId: string }) {
  const clerkUserId = await requireUserId();

  const [set] = await db
    .update(sets)
    .set({
      reps: input.reps,
      weight: input.weight,
      weightUnit: input.weightUnit,
      isWarmup: input.isWarmup ?? false,
      notes: input.notes,
    })
    .where(
      and(
        eq(sets.id, input.setId),
        inArray(sets.workoutExerciseId, ownedWorkoutExerciseIds(clerkUserId))
      )
    )
    .returning();

  return set ?? null;
}

export async function deleteSet(input: { setId: string }) {
  const clerkUserId = await requireUserId();

  const [deleted] = await db
    .delete(sets)
    .where(
      and(
        eq(sets.id, input.setId),
        inArray(sets.workoutExerciseId, ownedWorkoutExerciseIds(clerkUserId))
      )
    )
    .returning();

  return deleted ?? null;
}
