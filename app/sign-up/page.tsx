import Image from "next/image"
import { Dumbbell } from "lucide-react"

import { SignUpForm } from "@/app/sign-up/sign-up-form"
import loneBaseball from "@/public/lone-baseball.jpg"

export default function SignUpPage() {
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
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img 
          src="https://hhenvp4y5h3wlryn.public.blob.vercel-storage.com/some-baseballs-nKZ3kAsEA6TDNnd6NHduo8TWdfpaAS.jpg"
          alt="A single baseball in the middle of a dirt field" 
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
