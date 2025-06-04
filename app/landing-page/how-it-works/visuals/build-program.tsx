import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BuildProgram() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Program Builder</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <div className="flex w-full">
          <div className="flex-1">
            <div>
              <Label className="text-sm">Name</Label>
              <Input></Input>
            </div>
            <div>
              <Label className="text-sm">Tags</Label>
              <Input></Input>
            </div>
          </div>
          <div className="flex-1 p-2">
            <div className="bg-input/50 border h-full w-full rounded-md" />
          </div>
        </div>
        <div className="h-50 sm:h-80 grid grid-cols-[1fr_3fr] sm:grid-cols-[1fr_4fr] gap-2">
          <div className="h-full w-full border rounded-md bg-input/50 p-1 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <p className="text-sm sm:font-medium text-center mb-4">Workouts</p>
            <div className="grid gap-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="border-dashed border-2 rounded-md aspect-4/2 " />
              ))}
            </div>
          </div>
          <div className="h-full">
            <div className="w-full border rounded-md p-2 bg-input/50">
              <div className="text-sm sm:font-medium mb-1">Program Calendar</div>
              <div className="w-full grid grid-cols-7 gap-3">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="aspect-2/3 border-2 sm:border-3 hover:scale-101 border-dashed rounded-sm sm:rounded-md p-1 transition-all hover:border-muted-foreground">
                    <p className="hidden sm:block text-sm text-center">Day {i}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}