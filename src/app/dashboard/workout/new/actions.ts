"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().trim().max(100).optional(),
  performedStartAt: z.coerce.date(),
  notes: z.string().trim().max(2000).optional(),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(
  input: CreateWorkoutInput
): Promise<
  | { success: true; performedStartAt: Date }
  | { success: false; error: string }
> {
  const parsed = createWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const workout = await createWorkout({
    name: parsed.data.name || undefined,
    performedStartAt: parsed.data.performedStartAt,
    notes: parsed.data.notes || undefined,
  });

  revalidatePath("/dashboard");

  return { success: true, performedStartAt: workout.performedStartAt };
}
