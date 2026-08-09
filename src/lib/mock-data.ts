export type MockSet = {
  id: string
  setNumber: number
  reps: number
  weight: number
  weightUnit: "kg" | "lb"
  isWarmup: boolean
}

export type MockExercise = {
  id: string
  name: string
  category: string | null
  muscleGroup: string | null
  equipment: string | null
  order: number
  sets: MockSet[]
}

export type MockWorkout = {
  id: string
  name: string | null
  performedStartAt: string
  performedEndAt: string | null
  notes: string | null
  exercises: MockExercise[]
}

export const mockWorkouts: MockWorkout[] = [
  {
    id: "workout-1",
    name: "Push Day",
    performedStartAt: "2026-08-09T07:15:00.000",
    performedEndAt: "2026-08-09T08:20:00.000",
    notes: "Felt strong on bench today.",
    exercises: [
      {
        id: "exercise-1-1",
        name: "Bench Press",
        category: "Strength",
        muscleGroup: "Chest",
        equipment: "Barbell",
        order: 1,
        sets: [
          { id: "set-1-1-1", setNumber: 1, reps: 10, weight: 40, weightUnit: "kg", isWarmup: true },
          { id: "set-1-1-2", setNumber: 2, reps: 8, weight: 60, weightUnit: "kg", isWarmup: false },
          { id: "set-1-1-3", setNumber: 3, reps: 6, weight: 70, weightUnit: "kg", isWarmup: false },
        ],
      },
      {
        id: "exercise-1-2",
        name: "Overhead Press",
        category: "Strength",
        muscleGroup: "Shoulders",
        equipment: "Barbell",
        order: 2,
        sets: [
          { id: "set-1-2-1", setNumber: 1, reps: 8, weight: 30, weightUnit: "kg", isWarmup: false },
          { id: "set-1-2-2", setNumber: 2, reps: 8, weight: 35, weightUnit: "kg", isWarmup: false },
        ],
      },
    ],
  },
  {
    id: "workout-2",
    name: "Leg Day",
    performedStartAt: "2026-08-09T17:00:00.000",
    performedEndAt: null,
    notes: null,
    exercises: [
      {
        id: "exercise-2-1",
        name: "Back Squat",
        category: "Strength",
        muscleGroup: "Legs",
        equipment: "Barbell",
        order: 1,
        sets: [
          { id: "set-2-1-1", setNumber: 1, reps: 10, weight: 50, weightUnit: "kg", isWarmup: true },
          { id: "set-2-1-2", setNumber: 2, reps: 6, weight: 90, weightUnit: "kg", isWarmup: false },
        ],
      },
    ],
  },
  {
    id: "workout-3",
    name: "Pull Day",
    performedStartAt: "2026-08-07T06:30:00.000",
    performedEndAt: "2026-08-07T07:35:00.000",
    notes: null,
    exercises: [
      {
        id: "exercise-3-1",
        name: "Deadlift",
        category: "Strength",
        muscleGroup: "Back",
        equipment: "Barbell",
        order: 1,
        sets: [
          { id: "set-3-1-1", setNumber: 1, reps: 5, weight: 100, weightUnit: "kg", isWarmup: true },
          { id: "set-3-1-2", setNumber: 2, reps: 5, weight: 120, weightUnit: "kg", isWarmup: false },
        ],
      },
      {
        id: "exercise-3-2",
        name: "Barbell Row",
        category: "Strength",
        muscleGroup: "Back",
        equipment: "Barbell",
        order: 2,
        sets: [
          { id: "set-3-2-1", setNumber: 1, reps: 10, weight: 50, weightUnit: "kg", isWarmup: false },
          { id: "set-3-2-2", setNumber: 2, reps: 10, weight: 50, weightUnit: "kg", isWarmup: false },
        ],
      },
    ],
  },
  {
    id: "workout-4",
    name: "Full Body",
    performedStartAt: "2026-08-05T09:00:00.000",
    performedEndAt: "2026-08-05T09:50:00.000",
    notes: "Quick session before work.",
    exercises: [
      {
        id: "exercise-4-1",
        name: "Goblet Squat",
        category: "Strength",
        muscleGroup: "Legs",
        equipment: "Dumbbell",
        order: 1,
        sets: [
          { id: "set-4-1-1", setNumber: 1, reps: 12, weight: 20, weightUnit: "kg", isWarmup: false },
          { id: "set-4-1-2", setNumber: 2, reps: 12, weight: 20, weightUnit: "kg", isWarmup: false },
        ],
      },
    ],
  },
  {
    id: "workout-5",
    name: "Push Day (light)",
    performedStartAt: "2026-08-02T07:00:00.000",
    performedEndAt: "2026-08-02T07:40:00.000",
    notes: null,
    exercises: [
      {
        id: "exercise-5-1",
        name: "Incline Bench",
        category: "Strength",
        muscleGroup: "Chest",
        equipment: "Barbell",
        order: 1,
        sets: [
          { id: "set-5-1-1", setNumber: 1, reps: 10, weight: 30, weightUnit: "kg", isWarmup: true },
          { id: "set-5-1-2", setNumber: 2, reps: 10, weight: 45, weightUnit: "kg", isWarmup: false },
        ],
      },
    ],
  },
]
