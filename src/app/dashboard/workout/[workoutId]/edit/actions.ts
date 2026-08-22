"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { updateWorkout } from "@/data/workouts";
import { addExerciseToWorkout, removeExerciseFromWorkout } from "@/data/workout-exercises";
import { addSet, deleteSet, updateSet } from "@/data/sets";

const updateWorkoutSchema = z.object({
  workoutId: z.uuid(),
  name: z.string().trim().max(100).optional(),
  performedStartAt: z.coerce.date(),
  notes: z.string().trim().max(2000).optional(),
});

export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;

export async function updateWorkoutAction(
  input: UpdateWorkoutInput
): Promise<
  | { success: true; performedStartAt: Date }
  | { success: false; error: string }
> {
  const parsed = updateWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const workout = await updateWorkout(parsed.data.workoutId, {
    name: parsed.data.name || undefined,
    performedStartAt: parsed.data.performedStartAt,
    notes: parsed.data.notes || undefined,
  });

  if (!workout) {
    return { success: false, error: "Workout not found" };
  }

  revalidatePath("/dashboard");

  return { success: true, performedStartAt: workout.performedStartAt };
}

type ActionResult = { success: true } | { success: false; error: string };

function revalidateWorkout(workoutId: string) {
  revalidatePath(`/dashboard/workout/${workoutId}`);
  revalidatePath("/dashboard");
}

const addExerciseSchema = z.object({
  workoutId: z.uuid(),
  exerciseId: z.uuid(),
});

export type AddExerciseInput = z.infer<typeof addExerciseSchema>;

export async function addExerciseAction(
  input: AddExerciseInput
): Promise<ActionResult> {
  const parsed = addExerciseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const workoutExercise = await addExerciseToWorkout(parsed.data);
  if (!workoutExercise) {
    return { success: false, error: "Workout not found" };
  }

  revalidateWorkout(parsed.data.workoutId);
  return { success: true };
}

const removeExerciseSchema = z.object({
  workoutId: z.uuid(),
  workoutExerciseId: z.uuid(),
});

export type RemoveExerciseInput = z.infer<typeof removeExerciseSchema>;

export async function removeExerciseAction(
  input: RemoveExerciseInput
): Promise<ActionResult> {
  const parsed = removeExerciseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const deleted = await removeExerciseFromWorkout({
    workoutExerciseId: parsed.data.workoutExerciseId,
  });
  if (!deleted) {
    return { success: false, error: "Exercise not found on this workout" };
  }

  revalidateWorkout(parsed.data.workoutId);
  return { success: true };
}

const setFieldsSchema = {
  reps: z.number().int().min(1).max(999),
  weight: z.number().min(0).max(1500),
  weightUnit: z.enum(["kg", "lb"]),
  isWarmup: z.boolean().optional().default(false),
  notes: z.string().trim().max(500).optional(),
};

const addSetSchema = z.object({
  workoutId: z.uuid(),
  workoutExerciseId: z.uuid(),
  ...setFieldsSchema,
});

export type AddSetInput = z.infer<typeof addSetSchema>;

export async function addSetAction(input: AddSetInput): Promise<ActionResult> {
  const parsed = addSetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { workoutId, ...rest } = parsed.data;
  const set = await addSet(rest);
  if (!set) {
    return { success: false, error: "Exercise not found on this workout" };
  }

  revalidateWorkout(workoutId);
  return { success: true };
}

const updateSetSchema = z.object({
  workoutId: z.uuid(),
  setId: z.uuid(),
  ...setFieldsSchema,
});

export type UpdateSetInput = z.infer<typeof updateSetSchema>;

export async function updateSetAction(input: UpdateSetInput): Promise<ActionResult> {
  const parsed = updateSetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { workoutId, ...rest } = parsed.data;
  const set = await updateSet(rest);
  if (!set) {
    return { success: false, error: "Set not found" };
  }

  revalidateWorkout(workoutId);
  return { success: true };
}

const deleteSetSchema = z.object({
  workoutId: z.uuid(),
  setId: z.uuid(),
});

export type DeleteSetInput = z.infer<typeof deleteSetSchema>;

export async function deleteSetAction(input: DeleteSetInput): Promise<ActionResult> {
  const parsed = deleteSetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const deleted = await deleteSet({ setId: parsed.data.setId });
  if (!deleted) {
    return { success: false, error: "Set not found" };
  }

  revalidateWorkout(parsed.data.workoutId);
  return { success: true };
}
