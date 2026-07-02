"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Briefcase, MapPin, Calendar, Clock, DollarSign, BookOpen, AlertCircle, Code, User, Building, Database } from "lucide-react"
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

  const { internship, workspaceAssignment } = data.application

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Internship Details</h2>
        <p className="text-muted-foreground">Comprehensive information about your enrolled program.</p>
      </div>

      <Card className="border-t-4 border-t-primary-600 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <Badge className="mb-2">{internship.domain}</Badge>
              <CardTitle className="text-2xl text-navy-900 ">
                {workspaceAssignment?.internshipTitle || internship.title}
              </CardTitle>
            </div>
            <Badge variant="success">Active Enrollment</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-navy-900 ">Program Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-slate-50  p-4 rounded-lg border">
              {workspaceAssignment?.projectDescription || internship.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col p-4 bg-white rounded-lg border shadow-sm items-center text-center gap-2">
              <Calendar className="h-6 w-6 text-primary-500" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Duration</p>
                <p className="text-sm font-semibold text-navy-900 mt-0.5">{workspaceAssignment?.internshipDuration || internship.duration}</p>
              </div>
            </div>
            
            <div className="flex flex-col p-4 bg-white rounded-lg border shadow-sm items-center text-center gap-2">
              <Clock className="h-6 w-6 text-primary-500" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Mode</p>
                <p className="text-sm font-semibold text-navy-900 mt-0.5">{workspaceAssignment?.mode || internship.mode}</p>
              </div>
            </div>

            <div className="flex flex-col p-4 bg-white rounded-lg border shadow-sm items-center text-center gap-2">
              <MapPin className="h-6 w-6 text-primary-500" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Location</p>
                <p className="text-sm font-semibold text-navy-900 mt-0.5">{internship.centre}</p>
              </div>
            </div>

            <div className="flex flex-col p-4 bg-white rounded-lg border shadow-sm items-center text-center gap-2">
              <Building className="h-6 w-6 text-primary-500" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Type</p>
                <p className="text-sm font-semibold text-navy-900 mt-0.5">{workspaceAssignment?.internshipType || internship.type || 'N/A'}</p>
              </div>
            </div>
          </div>

          {workspaceAssignment && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-navy-900 border-b pb-2">
                  <Briefcase className="h-4 w-4 text-primary-500" /> Project Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Project Name</p>
                    <p className="text-sm font-medium">{workspaceAssignment.project?.title || 'Not Assigned'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="text-sm font-medium">{workspaceAssignment.startDate ? new Date(workspaceAssignment.startDate).toLocaleDateString() : 'TBD'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p className="text-sm font-medium">{workspaceAssignment.endDate ? new Date(workspaceAssignment.endDate).toLocaleDateString() : 'TBD'}</p>
                    </div>
                  </div>
                  {workspaceAssignment.project?.githubRepoUrl && (
                    <div>
                      <p className="text-xs text-muted-foreground">Repository</p>
                      <a href={workspaceAssignment.project.githubRepoUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline break-all">
                        {workspaceAssignment.project.githubRepoUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-navy-900 border-b pb-2">
                  <Code className="h-4 w-4 text-primary-500" /> Technology Stack
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Primary Stack</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {workspaceAssignment.project?.techStack ? (
                        (() => {
                          let parsed = [];
                          try {
                            parsed = JSON.parse(workspaceAssignment.project.techStack);
                          } catch {
                            parsed = workspaceAssignment.project.techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
                          }
                          return Array.isArray(parsed) ? parsed.map((tech: string, i: number) => (
                            <Badge key={i} variant="secondary" className="bg-slate-100">{tech}</Badge>
                          )) : <span className="text-sm text-muted-foreground">Not specified</span>;
                        })()
                      ) : (
                        <span className="text-sm text-muted-foreground">Not specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Languages / Frameworks</p>
                    <p className="text-sm font-medium">{workspaceAssignment.project?.programmingLanguages || 'N/A'} {workspaceAssignment.project?.frameworks ? `/ ${workspaceAssignment.project.frameworks}` : ''}</p>
                  </div>
                  {workspaceAssignment.project?.database && (
                    <div>
                      <p className="text-xs text-muted-foreground">Database</p>
                      <p className="text-sm font-medium flex items-center gap-1.5"><Database className="w-3 h-3 text-muted-foreground" /> {workspaceAssignment.project.database}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-navy-900 border-b pb-2">
                  <User className="h-4 w-4 text-primary-500" /> Mentorship
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned Mentor</p>
                    <p className="text-sm font-medium">{workspaceAssignment.mentor?.name || 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mentor Email</p>
                    <p className="text-sm font-medium">{workspaceAssignment.mentor?.email || 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Team / Batch</p>
                    <p className="text-sm font-medium">{workspaceAssignment.batch?.name || 'TBD'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
