import {
  pgTable, pgEnum, uuid, text, integer, numeric, boolean, timestamp,
  index, uniqueIndex, unique,
} from 'drizzle-orm/pg-core';

export const weightUnitEnum = pgEnum('weight_unit', ['kg', 'lb']);

export const exercises = pgTable('exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: text('category'),
  muscleGroup: text('muscle_group'),
  equipment: text('equipment'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('exercises_name_idx').on(t.name),
]);

export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkUserId: text('clerk_user_id').notNull(),
  name: text('name'),
  performedStartAt: timestamp('performed_start_at', { withTimezone: true }).notNull().defaultNow(),
  performedEndAt: timestamp('performed_end_at', { withTimezone: true }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('workouts_clerk_user_id_idx').on(t.clerkUserId),
  index('workouts_user_performed_start_at_idx').on(t.clerkUserId, t.performedStartAt),
]);

export const workoutExercises = pgTable('workout_exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutId: uuid('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id').notNull().references(() => exercises.id, { onDelete: 'restrict' }),
  order: integer('order').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('workout_exercises_workout_id_idx').on(t.workoutId),
  index('workout_exercises_exercise_id_idx').on(t.exerciseId),
  unique('workout_exercises_workout_order_unique').on(t.workoutId, t.order),
]);

export const sets = pgTable('sets', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutExerciseId: uuid('workout_exercise_id').notNull().references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps').notNull(),
  weight: numeric('weight', { precision: 6, scale: 2, mode: 'number' }).notNull(),
  weightUnit: weightUnitEnum('weight_unit').notNull().default('kg'),
  isWarmup: boolean('is_warmup').notNull().default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('sets_workout_exercise_id_idx').on(t.workoutExerciseId),
  unique('sets_workout_exercise_set_number_unique').on(t.workoutExerciseId, t.setNumber),
]);
