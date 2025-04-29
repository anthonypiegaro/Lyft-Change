import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { workoutFormSchema } from "@/lib/schemas/workout-form"

export default function WorkoutForm() {
  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {

    }
  })

  const onSubmit = async () => {

  }

  return (
    <div>
      My Form
    </div>
  )
}