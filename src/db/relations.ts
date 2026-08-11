import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  workouts: {
    workoutExercises: r.many.workoutExercises(),
  },
  exercises: {
    workoutExercises: r.many.workoutExercises(),
  },
  workoutExercises: {
    workout: r.one.workouts({ from: r.workoutExercises.workoutId, to: r.workouts.id }),
    exercise: r.one.exercises({ from: r.workoutExercises.exerciseId, to: r.exercises.id, optional: false }),
    sets: r.many.sets(),
  },
  sets: {
    workoutExercise: r.one.workoutExercises({ from: r.sets.workoutExerciseId, to: r.workoutExercises.id }),
  },
}));
