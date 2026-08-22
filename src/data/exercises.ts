import "server-only";
import db from "@/db";
import { requireUserId } from "@/data/auth";

export async function listExercises() {
  await requireUserId();

  return db.query.exercises.findMany({
    orderBy: { name: "asc" },
  });
}

export type Exercise = Awaited<ReturnType<typeof listExercises>>[number];
