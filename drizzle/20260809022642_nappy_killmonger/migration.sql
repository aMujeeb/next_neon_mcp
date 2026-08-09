CREATE TYPE "weight_unit" AS ENUM('kg', 'lb');--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"category" text,
	"muscle_group" text,
	"equipment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workout_exercise_id" uuid NOT NULL,
	"set_number" integer NOT NULL,
	"reps" integer NOT NULL,
	"weight" numeric(6,2) NOT NULL,
	"weight_unit" "weight_unit" DEFAULT 'kg'::"weight_unit" NOT NULL,
	"is_warmup" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sets_workout_exercise_set_number_unique" UNIQUE("workout_exercise_id","set_number")
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workout_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workout_exercises_workout_order_unique" UNIQUE("workout_id","order")
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"clerk_user_id" text NOT NULL,
	"name" text,
	"performed_start_at" timestamp with time zone DEFAULT now() NOT NULL,
	"performed_end_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exercises_name_idx" ON "exercises" ("name");--> statement-breakpoint
CREATE INDEX "sets_workout_exercise_id_idx" ON "sets" ("workout_exercise_id");--> statement-breakpoint
CREATE INDEX "workout_exercises_workout_id_idx" ON "workout_exercises" ("workout_id");--> statement-breakpoint
CREATE INDEX "workout_exercises_exercise_id_idx" ON "workout_exercises" ("exercise_id");--> statement-breakpoint
CREATE INDEX "workouts_clerk_user_id_idx" ON "workouts" ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "workouts_user_performed_start_at_idx" ON "workouts" ("clerk_user_id","performed_start_at");--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_workout_exercise_id_workout_exercises_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_workouts_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_exercises_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT;