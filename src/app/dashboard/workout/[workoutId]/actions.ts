"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { updateWorkout } from "@/data/workouts";

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
