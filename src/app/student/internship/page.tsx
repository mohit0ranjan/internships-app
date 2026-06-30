"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Briefcase, MapPin, Calendar, Clock, DollarSign, BookOpen, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import useSWR from "swr"

export default function InternshipDetailsPage() {
  const { data, error, isLoading } = useSWR('/api/student/dashboard')

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card className="border-t-4 border-t-primary-600 shadow-md">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !data?.application?.internship) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-navy-900">No Internship Assigned Yet</h3>
        <p className="text-muted-foreground max-w-md">
          You are not currently assigned to an active internship. Once your application is fully processed and a workspace is generated, your internship details will appear here.
        </p>
      </div>
    )
  }

  const { internship } = data.application

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Internship Details</h2>
        <p className="text-muted-foreground">Comprehensive information about your enrolled program.</p>
      </div>

      <Card className="border-t-4 border-t-primary-600 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <Badge className="mb-2">{internship.domain}</Badge>
              <CardTitle className="text-2xl text-navy-900 ">{internship.title}</CardTitle>
            </div>
            <Badge variant="success">Active Enrollment</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-navy-900 ">Program Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-slate-50  p-4 rounded-lg border">
              {internship.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 bg-white  rounded-lg border">
              <Calendar className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-semibold text-navy-900 ">{internship.duration}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white  rounded-lg border">
              <Clock className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Mode</p>
                <p className="text-sm font-semibold text-navy-900 ">{internship.mode}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white  rounded-lg border">
              <MapPin className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Centre</p>
                <p className="text-sm font-semibold text-navy-900 ">{internship.centre}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white  rounded-lg border">
              <DollarSign className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Stipend / Fees</p>
                <p className="text-sm font-semibold text-navy-900 ">{internship.stipend || 'Not Applicable'}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold mb-2 text-navy-900 ">
              <BookOpen className="h-4 w-4 text-primary-500" /> Eligibility Criteria
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-slate-50  p-4 rounded-lg border">
              {internship.eligibility}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
