import Link from "next/link"
import BuildTabs from "./build-tabs"

export default function BuildLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full">
      <div className="flex justify-center w-full py-20">
        <BuildTabs />
      </div>
      {children}
    </div>
  )
}