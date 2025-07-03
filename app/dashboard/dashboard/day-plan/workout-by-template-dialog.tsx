"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

import { Template, TemplateTag } from "./day-plan"
import { TemplateList } from "./template-list"

export function WorkoutByTemplateDialog({
  workoutTemplates,
  templateTags
}: {
  workoutTemplates: Template[]
  templateTags: TemplateTag[]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Start workout from template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Template</DialogTitle>
          <DialogDescription>
            Start a new exercise by selecting a template
          </DialogDescription>
        </DialogHeader>
        <TemplateList workoutTemplates={workoutTemplates} templateTags={templateTags} />
      </DialogContent>
    </Dialog>
  )
}