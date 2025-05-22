import Link from "next/link"
import { LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotAuthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <div className="rounded-full p-3 bg-background">
              <LockIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">403</CardTitle>
          <p className="text-muted-foreground">Access Forbidden</p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Lyft Change</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this resource.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/dashboard">Return to the Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
