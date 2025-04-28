import { exerciseTypeRegistry } from "@/lib/exercise-type-registry"

type WeightRepsSet = {
  weight: Number;
  reps: Number;
}

type TimeDistanceSet = {
  time: Number;
  distance: Number;
}

type Exercise =
  |
    {
      name: string;
      type: "weightReps";
      sets: WeightRepsSet[]
    }
  |
    {
      name: string;
      type: "timeDistance";
      sets: TimeDistanceSet[]
    }

interface WorkoutData {
  name: string;
  date: string;
  exercises: Exercise[];
}

const fakeData: WorkoutData = {
  name: "Leg Day",
  date: "04/20/1969",
  exercises: [
    {
      name: "Belt Squat",
      type: "weightReps",
      sets: [
        {
          weight: 315,
          reps: 10
        },
        {
          weight: 315,
          reps: 10
        },
        {
          weight: 315,
          reps: 12
        }
      ]
    },
    {
      name: "jog",
      type: "timeDistance",
      sets: [
        {
          time: 1300,
          distance: 3000
        }
      ]
    }
  ]
}

export default function WorkoutForm() {
  return (
    <div className="flex flex-1 flex-col gap-y-4">
      {fakeData.exercises.map((exercise, index) => (
        <div key={index}>
          <h2>{exercise.name}</h2>
          <table>
            <thead>
              <tr>
                <th className="px-1">Set</th>
                {exerciseTypeRegistry[exercise.type].inputs.map(input => (
                  <th className="px-1" key={input.name as string}>{input.name}</th>
                ))}
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {exercise.sets.map((set, index) => (
                <tr>
                  <td className="px-1">{index + 1}</td>
                  {exerciseTypeRegistry[exercise.type].inputs.map(input => (
                    <td className="px-1">{set[input.name as keyof typeof set]}
                      <input.component />
                    </td>
                  ))}
                  <td className="px-1">
                    <input type="checkbox" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}