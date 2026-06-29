"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, FileText, ArrowRight, Loader2, PlayCircle, Lock, BookOpen, AlertTriangle, Download, Code2, MonitorPlay, Award } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

export default function StudentDashboard() {
  const { data, error, isLoading } = useSWR('/api/student/dashboard');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-primary-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-3 backdrop-blur-sm">
              {data?.application?.status?.replace('_', ' ') || 'ACTIVE WORKSPACE'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {data?.application?.user?.name?.split(' ')[0] || 'Student'}!
            </h2>
            <p className="text-navy-100 mt-2 max-w-xl">
              You are currently enrolled in the <strong className="text-white">{data?.application?.internship?.title || 'Internship Program'}</strong>. 
              Keep up the good work and don't forget to submit your weekly progress.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button className="bg-accent-500 hover:bg-accent-600 text-white border-none shadow-lg w-full sm:w-auto" asChild>
              <Link href="/student/attendance">
                Mark Today's Attendance
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white  rounded-xl border border-navy-100">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Failed to load dashboard data. Please refresh.
        </div>
      ) : (
        <>
          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-12 lg:grid-cols-3">
            
            {/* Left Column - 2/3 width on large screens */}
            <div className="md:col-span-12 lg:col-span-2 space-y-6">
              
              {/* Current Project Card */}
              <Card className="border-navy-100 shadow-sm overflow-hidden border-t-4 border-t-primary-500">
                <CardHeader className="bg-navy-50/50  border-b border-navy-50 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary-600" /> Current Project Assignment
                      </CardTitle>
                      <CardDescription className="mt-1">Your assigned live government project workspace.</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white">Live Project</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {data?.application?.project ? (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-xl font-bold text-navy-900 ">
                          {data.application.project.title}
                        </h3>
                        <p className="text-navy-600  mt-2 leading-relaxed">
                          {data.application.project.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {data.application.project.techStack ? (
                          (() => {
                            let parsed = [];
                            try {
                              parsed = JSON.parse(data.application.project.techStack);
                            } catch {
                              parsed = data.application.project.techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
                            }
                            return Array.isArray(parsed) ? parsed.map((tech: string, i: number) => (
                              <Badge key={i} variant="secondary" className="bg-navy-100 text-navy-700 hover:bg-navy-200">{tech}</Badge>
                            )) : null;
                          })()
                        ) : <span className="text-sm text-navy-400 font-medium">Tech stack not specified</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Code2 className="w-8 h-8 text-navy-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-navy-900">No Project Assigned Yet</h3>
                      <p className="text-navy-500 mt-1 max-w-sm mx-auto">
                        Your mentor will assign a project to you soon. Complete your orientation modules in the meantime.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-navy-50/50  border-t border-navy-50 p-4">
                  <Button variant="default" className="w-full sm:w-auto" asChild disabled={!data?.application?.project}>
                    <Link href="/student/project">
                      Open Project Workspace <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Progress & Milestones */}
              <div className="grid gap-6 sm:grid-cols-2">
                <Card className="border-navy-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent  opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-navy-500 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Attendance Record
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-navy-900 ">{data?.attendanceCount || 0}</span>
                      <span className="text-sm font-medium text-navy-500">days present</span>
                    </div>
                    <div className="w-full bg-navy-100 h-2 rounded-full mt-4 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(((data?.attendanceCount || 0) / 90) * 100, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-navy-400 mt-2 text-right">Target: 90 days</p>
                  </CardContent>
                </Card>

                <Card className="border-navy-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent  opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-navy-500 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-500" /> Weekly Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-navy-900 ">{data?.progressCount || 0}</span>
                      <span className="text-sm font-medium text-navy-500">submitted</span>
                    </div>
                    <Button variant="link" className="px-0 mt-2 h-auto text-primary-600 font-semibold" asChild>
                      <Link href="/student/progress">Submit new report <ArrowRight className="w-3 h-3 ml-1" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

            </div>
            
            {/* Right Column - 1/3 width on large screens */}
            <div className="md:col-span-12 lg:col-span-1 space-y-6">
              
              {/* Certificate Status */}
              <Card className="border-navy-100 shadow-sm bg-gradient-to-b from-white to-navy-50/50  ">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent-500" /> Certificate Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  {data?.certificate ? (
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                        <Award className="w-10 h-10 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy-900 ">Certificate Ready</h4>
                        <p className="text-xs font-mono text-navy-500 mt-1 bg-white inline-block px-2 py-1 border rounded">
                          {data.certificate.certificateNumber}
                        </p>
                      </div>
                      <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" asChild>
                        <Link href={`/verify/${data.certificate.certificateNumber}`} target="_blank">
                          <Download className="w-4 h-4" /> Download Certificate
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-navy-100 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm grayscale opacity-60">
                        <Award className="w-10 h-10 text-navy-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy-900 ">Not Eligible Yet</h4>
                        <p className="text-sm text-navy-500 mt-1">
                          Complete the minimum duration and submit all weekly reports to unlock your certificate.
                        </p>
                      </div>
                      <div className="w-full bg-navy-200 h-1.5 rounded-full overflow-hidden mt-4">
                        <div className="bg-navy-400 h-full rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Learning Resources */}
              <Card className="border-navy-100 shadow-sm">
                <CardHeader className="pb-3 border-b border-navy-50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-600" /> Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-navy-50">
                    <a href="#" className="flex items-start gap-3 p-4 hover:bg-navy-50 transition-colors group">
                      <div className="w-8 h-8 rounded bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                        <MonitorPlay className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-navy-900  group-hover:text-primary-600 transition-colors">Orientation Video</h4>
                        <p className="text-xs text-navy-500 mt-0.5">Introduction to CSDAC WBL.</p>
                      </div>
                    </a>
                    <a href="#" className="flex items-start gap-3 p-4 hover:bg-navy-50 transition-colors group">
                      <div className="w-8 h-8 rounded bg-accent-50 flex items-center justify-center shrink-0 group-hover:bg-accent-100 transition-colors">
                        <FileText className="w-4 h-4 text-accent-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-navy-900  group-hover:text-accent-600 transition-colors">Coding Guidelines</h4>
                        <p className="text-xs text-navy-500 mt-0.5">Standard practices for Govt projects.</p>
                      </div>
                    </a>
                    <div className="flex items-start gap-3 p-4 opacity-50 cursor-not-allowed">
                      <div className="w-8 h-8 rounded bg-navy-100 flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4 text-navy-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-navy-900  flex items-center gap-2">
                          Advanced Modules <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">LOCKED</Badge>
                        </h4>
                        <p className="text-xs text-navy-500 mt-0.5">Unlocks after Week 2.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
