import { WorkoutFormSkeleton } from "../../workout-form-skeleton";

export default function loading() {
  return (
    <div className="flex justify-center w-full py-10 pb-20 md:pb-10 md:px-0 px-4">
      <WorkoutFormSkeleton />
    </div>
  )
}