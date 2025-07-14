import BuildTabs from "./build-tabs"

export default function BuildLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full">
      <div className="flex justify-center w-full mt-20 mb-10 xl:mb-15">
        <BuildTabs />
      </div>
      {children}
    </div>
  )
}