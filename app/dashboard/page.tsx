import { Calendar } from "@/components/calendar/calendar";

const workoutEvents = [
  // Early in the month
  {
    id: "1",
    name: "Chest & Triceps",
    date: new Date(2025, 4, 2), // May 2, 2025
  },
  {
    id: "2",
    name: "Morning Cardio",
    date: new Date(2025, 4, 2), // May 2, 2025 (same day, multiple events)
  },
  {
    id: "3",
    name: "Back & Biceps",
    date: new Date(2025, 4, 5), // May 5, 2025
  },
  {
    id: "4",
    name: "Yoga",
    date: new Date(2025, 4, 7), // May 7, 2025
  },
  // Middle of the month
  {
    id: "5",
    name: "Legs",
    date: new Date(2025, 4, 12), // May 12, 2025
  },
  {
    id: "6",
    name: "HIIT",
    date: new Date(2025, 4, 12), // May 12, 2025 (same day, multiple events)
  },
  {
    id: "7",
    name: "Core",
    date: new Date(2025, 4, 15), // May 15, 2025
  },
  {
    id: "8",
    name: "Rest Day",
    date: new Date(2025, 4, 16), // May 16, 2025
  },
  // Later in the month
  {
    id: "9",
    name: "Shoulders",
    date: new Date(2025, 4, 21), // May 21, 2025
  },
  {
    id: "10",
    name: "Evening Run",
    date: new Date(2025, 4, 21), // May 21, 2025 (same day, multiple events)
  },
  {
    id: "11",
    name: "Full Body",
    date: new Date(2025, 4, 25), // May 25, 2025
  },
  {
    id: "12",
    name: "Pilates",
    date: new Date(2025, 4, 28), // May 28, 2025
  },
  {
    id: "13",
    name: "Stretching",
    date: new Date(2025, 4, 28), // May 28, 2025 (same day, multiple events)
  },
  {
    id: "14",
    name: "Cardio",
    date: new Date(2025, 4, 30), // May 30, 2025
  },
];

export default function DashboardPage() {
  return (
      <div className="w-full max-h-screen p-4 pt-10">
        <Calendar events={workoutEvents}/>
      </div>
  )
}