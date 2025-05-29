"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MobileWarningBanner() {
  const [show, setShow] = useState(true)

  return (
    <>
      <div className={cn(
        "sm:hidden z-1000 w-screen flex items-center justify-center px-10 h-20 border-b fixed top-0 left-0 overflow-hidden bg-amber-700/50 border-amber-700 backdrop-blur-xs",
        !show && "hidden"
      )}>
        <p className="text-xs font-medium text-center">
          Warning: Web version not optimized for mobile use, may experience issues. Use the mobile app.
        </p>
        <Button className="fixed right-2" variant="ghost" onClick={() => setShow(false)}>
          <X />
        </Button>
      </div>
    </>
  )
}