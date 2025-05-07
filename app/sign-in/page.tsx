import Image from "next/image"
import { Dumbbell } from "lucide-react"

import { SignInForm } from "@/app/sign-in/sign-in-form"
import someBaseballs from "@/public/some-baseballs.jpg"

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Dumbbell className="size-4" />
            </div>
            Lyft Change
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://hhenvp4y5h3wlryn.public.blob.vercel-storage.com/lone-baseball-TUVg0kCXnQWPrIQLwo87nIEevMW30i.jpg"
          alt="Three baseballs scattered on an infield"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>
      </div>
    </div>
  )
}
