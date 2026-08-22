import { isToday } from "date-fns"

export function isWorkoutEditable(performedStartAt: Date) {
  return isToday(performedStartAt)
}
