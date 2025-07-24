import AnalyticsTabs from "./analytics-tabs"

export default function AnalyticsLayout({ 
  children 
}: { 
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-5 md:py-10">
      <AnalyticsTabs />
      {children}
    </div>
  )
}