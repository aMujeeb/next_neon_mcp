import "server-only";
import { and, eq } from "drizzle-orm";
import db from "@/db";
import { workouts } from "@/db/schema";
import { requireUserId } from "@/data/auth";

export async function createWorkout(input: {
  name?: string;
  performedStartAt: Date;
  notes?: string;
}) {
  const clerkUserId = await requireUserId();

  const [workout] = await db
    .insert(workouts)
    .values({ ...input, clerkUserId })
    .returning();

  return workout;
}

export async function getWorkoutById(workoutId: string) {
  const clerkUserId = await requireUserId();

  return db.query.workouts.findFirst({
    where: {
      id: workoutId,
      clerkUserId,
    },
    with: {
      workoutExercises: {
        orderBy: { order: "asc" },
        with: {
          exercise: true,
          sets: {
            orderBy: { setNumber: "asc" },
          },
        },
      },
    },
  });
}

export async function updateWorkout(
  workoutId: string,
  input: {
    name?: string;
    performedStartAt: Date;
    notes?: string;
  }
) {
  const clerkUserId = await requireUserId();

  const [workout] = await db
    .update(workouts)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(workouts.id, workoutId), eq(workouts.clerkUserId, clerkUserId)))
    .returning();

  return workout;
}

export async function getWorkoutsForDate(date: Date) {
  const clerkUserId = await requireUserId();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return db.query.workouts.findMany({
    where: {
      clerkUserId,
      performedStartAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    with: {
      workoutExercises: {
        orderBy: { order: "asc" },
        with: {
          exercise: true,
          sets: {
            orderBy: { setNumber: "asc" },
          },
        },
      },
    },
    orderBy: { performedStartAt: "asc" },
  });
}

export type WorkoutWithDetails = Awaited<ReturnType<typeof getWorkoutsForDate>>[number];
export type WorkoutExerciseDetail = WorkoutWithDetails["workoutExercises"][number];
export type SetDetail = WorkoutExerciseDetail["sets"][number];
