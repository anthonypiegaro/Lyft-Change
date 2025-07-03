"use client"

import { 
  useCallback, 
  useMemo, 
  useRef, 
  useState 
} from "react"
import { useRouter } from "next/navigation"
import { useVirtualizer } from "@tanstack/react-virtual"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { cn } from "@/lib/utils"

import { Template, TemplateTag } from "./day-plan"
import { createWorkoutFromTemplate } from "./create-workout-from-template.action"

export function TemplateList({
  workoutTemplates,
  templateTags
}: {
  workoutTemplates: Template[]
  templateTags: TemplateTag[]
}) {
  const parentRef = useRef(null)
  const router = useRouter()

  const [canClose, setCanClose] = useState(false)
  const [error, setError] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [workoutName, setWorkoutName] = useState("")
  const [nameFilter, setNameFilter] = useState("")
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const sortedTemplateTags = useMemo(() => templateTags.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())), [templateTags])
  const sortedWorkoutTemlpates = useMemo(() => workoutTemplates.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())), [workoutTemplates])

  const filteredTemplates = useMemo(() => {
    return sortedWorkoutTemlpates
      .filter(template => template.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(template => tagFilter.every(
        tagId => template.tags.some(templateTag => templateTag.id === tagId)
      ))
  }, [workoutTemplates, nameFilter, tagFilter])

  const getItemKey = useCallback(
    (index: number) => filteredTemplates[index].id,
    [filteredTemplates]
  )

  const virtualizer = useVirtualizer({
    count: filteredTemplates.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize: () => 85,
    paddingStart: 10,
    paddingEnd: 10
  })

  const handleTemplateClick = async (workoutId: string, workoutName: string) => {
    setCanClose(false)
    setWorkoutName(workoutName)
    setOpenDialog(true)
    await createWorkoutFromTemplate(workoutId)
      .then(data => {
        router.push(`/dashboard/workout/${data.instanceId}`)
      })
      .catch(error => {
        setError(error.message)
        setCanClose(true)
      })
  }

  const handleOpenChange = (open: boolean) => {
    if (open === false && canClose) {
      setOpenDialog(false)
      setWorkoutName("")
      setError("")
      setCanClose(false)
    } else if (open === false) {
      return
    } else {
      setOpenDialog(true)
    }
  }

  return (
    <div className="w-full">
      <BuildingWorkoutPopup 
        open={openDialog}
        onOpenChange={handleOpenChange}
        error={error}
        workoutName={workoutName}
      />
      <div className="flex flex-col gap-y-2 mb-2">
        <div>
          <Label className="mb-1.5">Name</Label>
          <Input value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="tag-ids-filter" className="mb-1.5">Tags</Label>
          <MultiSelect
            id="tag-ids-filter"
            options={sortedTemplateTags.map(tag => ({ label: tag.name, value: tag.id}))}
            maxCount={3}
            onValueChange={setTagFilter}
            className="dark:bg-input/30"
          />
        </div>
      </div>
      <div
        ref={parentRef}
        className="h-86 relative w-full overflow-auto mask-b-from-95% mask-t-from-95%"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative"
          }}
        >
          {virtualizer.getVirtualItems().map(virtualItem => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height:"85px",
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`
              }}
              className="py-1 border-b hover:bg-accent flex flex-col justify-center"
              onClick={() => handleTemplateClick(filteredTemplates[virtualItem.index].id, filteredTemplates[virtualItem.index].name)}
            >
              <div className="text-lg font-medium w-full truncate">
                {filteredTemplates[virtualItem.index].name}
              </div>
              <div className="w-full truncate">
                {filteredTemplates[virtualItem.index].tags.map(tag => (
                  <Badge key={tag.id} className="mr-1">{tag.name}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BuildingWorkoutPopup({
  open,
  onOpenChange,
  error,
  workoutName
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  error: string
  workoutName: string
}) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {error.length === 0 ? `Building Workout: ${workoutName}` : `Error Building Workout ${workoutName}`}
          </DialogTitle>
          <DialogDescription>
            {
              error.length === 0
              ? "Getting your workout ready. We'll send you to it in just a moment."
              : error
            }
          </DialogDescription>
        </DialogHeader>
        <div className={cn("w-full flex justify-end", error.length === 0 && "hidden")}>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}