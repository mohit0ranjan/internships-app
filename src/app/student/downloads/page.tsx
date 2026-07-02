import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function DownloadsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Downloads & Resources</h2>
          <p className="text-muted-foreground">Access study materials, templates, and guidelines.</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white border rounded-xl shadow-sm">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-navy-900">No Resources Available</h3>
        <p className="text-muted-foreground max-w-md">
          There are currently no documents or resources available for download. Please check back later.
        </p>
      </div>
    </div>
  )
}
