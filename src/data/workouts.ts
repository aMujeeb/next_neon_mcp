import "server-only";
import db from "@/db";
import { requireUserId } from "@/data/auth";

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
