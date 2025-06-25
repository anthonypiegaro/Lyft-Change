import AnalyticsTabs from "./analytics-tabs"

export default function AnalyticsLayout({ 
  children 
}: { 
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-full py-5 md:py-10">
      <AnalyticsTabs />
      {children}
    </div>
  )
}