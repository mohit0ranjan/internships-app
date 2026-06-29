import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, FileCode, PlayCircle, Lock } from "lucide-react"

export default function DownloadsPage() {
  const resources = [
    {
      id: 1,
      title: "CSDAC Internship Orientation Handbook",
      type: "PDF",
      size: "2.4 MB",
      icon: <FileText className="h-8 w-8 text-red-500" />,
      locked: false,
    },
    {
      id: 2,
      title: "Standard Coding Guidelines (Enterprise)",
      type: "PDF",
      size: "1.1 MB",
      icon: <FileText className="h-8 w-8 text-red-500" />,
      locked: false,
    },
    {
      id: 3,
      title: "Next.js & Prisma Starter Template",
      type: "ZIP",
      size: "15.8 MB",
      icon: <FileCode className="h-8 w-8 text-blue-500" />,
      locked: false,
    },
    {
      id: 4,
      title: "Database Architecture Diagram",
      type: "PNG",
      size: "3.2 MB",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      locked: false,
    },
    {
      id: 5,
      title: "Advanced Authentication Module",
      type: "VIDEO",
      size: "142 MB",
      icon: <PlayCircle className="h-8 w-8 text-purple-500" />,
      locked: true,
    }
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Downloads & Resources</h2>
          <p className="text-muted-foreground">Access study materials, templates, and guidelines.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((res) => (
          <Card key={res.id} className={`flex flex-col h-full ${res.locked ? 'opacity-75 bg-slate-50 ' : ''}`}>
            <CardHeader className="flex-1 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary-50  rounded-lg">
                  {res.icon}
                </div>
                <Badge variant={res.locked ? "outline" : "secondary"}>{res.type}</Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{res.title}</CardTitle>
              <CardDescription className="mt-2">Size: {res.size}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              {res.locked ? (
                <Button variant="outline" className="w-full text-muted-foreground" disabled>
                  <Lock className="mr-2 h-4 w-4" /> Unlocks Week 4
                </Button>
              ) : (
                <Button className="w-full" variant="default">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
