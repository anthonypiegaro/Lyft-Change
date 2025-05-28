"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useVirtualizer } from "@tanstack/react-virtual"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { deleteExerciseTag, deleteProgramTag, deleteWorkoutTag } from "./delete-tag.action"

type Tag = {
  id: string,
  name: string
}

export function DeleteTags({
  tags,
  type,
  onDelete
}: {
  tags: Tag[]
  type: "exercise" | "workout" | "program"
  onDelete: () => void
}) {
  const [nameFilter, setNameFilter] = useState("")
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const parentRef = useRef(null)

  const filteredTags = useMemo(() => {
    return tags.filter(tag => tag.name.toLowerCase().includes(nameFilter.toLowerCase()))
    }, [nameFilter]
  )

  const getItemKey = useCallback(
    (index: number) => filteredTags[index].id,
    [filteredTags]
  )

  const rowVirtualizer = useVirtualizer({
    count: filteredTags.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize: () => 65
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedTag(null)
    }
  }

  const handleDelete = () => {
    setSelectedTag(null)
    onDelete()
  }

  return (
    <div>
      <Confirmation 
        tag={selectedTag} 
        open={selectedTag !== null}
        onOpenChange={handleOpenChange}
        type={type}
        onDelete={handleDelete}
      />
      <Input value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
      <div ref={parentRef} className="h-86 relative w-full overflow-auto mask-b-from-95% mask-t-from-95%">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}  
        >
          {rowVirtualizer.getVirtualItems().map(virtualItem => {
            const tag = filteredTags[virtualItem.index]

            return (
              <div
                key={virtualItem.key} 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: "65px",
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="py-1 border-b hover:bg-accent flex flex-col justify-center"
                onClick={() => setSelectedTag(tag)}
              >
                <p className="text-lg font-medium w-full truncate">
                  {tag.name}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Confirmation({
  open,
  onOpenChange,
  tag,
  type,
  onDelete
}: {
  tag: Tag | null,
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "exercise" | "workout" | "program"
  onDelete: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const handleDelete = async () => {
    setIsSubmitting(true)

    let deleteFunc: (id: string) => Promise<void>;

    if (type === "exercise") {
      deleteFunc = deleteExerciseTag
    } else if (type === "workout") {
      deleteFunc = deleteWorkoutTag
    } else {
      deleteFunc = deleteProgramTag
    }

    await deleteFunc(tag?.id as string)
      .then(() => {
        toast.success("Success", {
          description: "Tag has been deleted successfully"
        })
        onOpenChange(false)
        onDelete()
        router.refresh()
      })
      .catch(error => {
        toast.error("Error", {
          description: error.message
        })
      })

    setIsSubmitting(false)
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tag</DialogTitle>
          <p>Are you sure you want to delete <span className="text-destructive">{tag?.name}</span>? 
            This action cannot be undone.
          </p>
          <div>
            <Button 
              variant="ghost" 
              className="mr-2"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="destructive" disabled={isSubmitting} onClick={() => handleDelete()}>
              Delete
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}