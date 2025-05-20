import { CalendarWrapper } from "./calendarWrapper";

const workoutEvents = [
  { id: "1", name: "Chest & Triceps", date: "2025-05-02" },
  { id: "2", name: "Morning Cardio", date: "2025-05-02" },
  { id: "3", name: "Back & Biceps", date: "2025-05-05" },
  { id: "4", name: "Yoga", date: "2025-05-07" },
  { id: "5", name: "Legs", date: "2025-05-12" },
  { id: "6", name: "HIIT", date: "2025-05-12" },
  { id: "7", name: "Core", date: "2025-05-15" },
  { id: "8", name: "Rest Day", date: "2025-05-16" },
  { id: "9", name: "Shoulders", date: "2025-05-21" },
  { id: "10", name: "Evening Run", date: "2025-05-21" },
  { id: "11", name: "Full Body", date: "2025-05-25" },
  { id: "12", name: "Pilates", date: "2025-05-28" },
  { id: "13", name: "Stretching", date: "2025-05-28" },
  { id: "14", name: "Cardio", date: "2025-05-30" },
];

export default function DashboardPage() {

  return (
      <div className="w-full max-h-screen p-4 pt-10">
        <CalendarWrapper events={workoutEvents}/>
      </div>
  )
}