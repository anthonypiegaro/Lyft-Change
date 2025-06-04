import { Profile } from "./profile";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center fixed top-0 left-0 w-full p-6 lg:px-12 backdrop-blur z-50">
      <h1 className="text-2xl font-bold">
        <a href="#hero" >Lyft<span className="text-zinc-700 dark:text-zinc-400">Change</span></a>
      </h1>
      <div className="flex items-center text-lg gap-x-6">
        <a 
          className="hidden sm:block relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full" 
          href="#features"
        >
          Features
        </a>
        <a 
          className="hidden sm:block relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full" 
          href="#how-it-works"
        >
          How It Works
        </a>
        <a 
          className="hidden sm:block relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
          href="#pricing"
        >
          Pricing
        </a>
        <Profile />
      </div>
    </nav>
  )
}