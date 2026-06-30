"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, FileText, CheckCircle, TrendingUp, AlertCircle, 
  ArrowRight, Building, CheckSquare, Award, LifeBuoy, 
  Loader2, Activity, CreditCard
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminDashboard() {
  const { data, error, isLoading } = useSWR('/api/admin/dashboard');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      toast.success("Report exported successfully.");
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-xl border border-navy-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900">Admin Dashboard</h2>
          <p className="text-navy-500 mt-1">Real-time overview of the internship ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />} 
            Export Report
          </Button>
          <Button asChild className="gap-2">
            <Link href="/admin/applicants"><Users className="w-4 h-4" /> View Applicants</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-navy-100 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
          <p className="text-navy-500 animate-pulse">Loading dashboard statistics...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200 flex flex-col items-center">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="font-semibold text-lg">Failed to load dashboard data</p>
          <p className="text-sm">Please check your network or try again later.</p>
          <Button variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-100" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            
            <Card className="bg-white border-navy-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <CardTitle className="text-sm font-medium text-navy-600">Total Applications</CardTitle>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-navy-900">{data?.stats?.totalApplications || 0}</div>
                <p className="text-xs text-blue-600 flex items-center mt-2 font-medium bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                  All Time Submissions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-navy-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <CardTitle className="text-sm font-medium text-navy-600">Selected Students</CardTitle>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-navy-900">{data?.stats?.selectedStudents || 0}</div>
                <p className="text-xs text-emerald-700 flex items-center mt-2 font-medium bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                  Cleared Screening
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-navy-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <CardTitle className="text-sm font-medium text-navy-600">Workspaces Generated</CardTitle>
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Building className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-navy-900">{data?.stats?.workspacesGenerated || 0}</div>
                <p className="text-xs text-purple-700 flex items-center mt-2 font-medium bg-purple-50 w-fit px-2 py-0.5 rounded-full">
                  Active Projects
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-navy-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <CardTitle className="text-sm font-medium text-navy-600">Active Interns</CardTitle>
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-navy-900">{data?.stats?.activeInterns || 0}</div>
                <p className="text-xs text-primary-700 flex items-center mt-2 font-medium bg-primary-50 w-fit px-2 py-0.5 rounded-full">
                  Currently Enrolled
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-navy-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <CardTitle className="text-sm font-medium text-navy-600">Certificates Generated</CardTitle>
                <div className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-accent-600">
                  <Award className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-navy-900">{data?.stats?.certificatesGenerated || 0}</div>
                <p className="text-xs text-accent-700 flex items-center mt-2 font-medium bg-accent-50 w-fit px-2 py-0.5 rounded-full">
                  Issued to Students
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-navy-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <CardTitle className="text-sm font-medium text-navy-600">Payments Received</CardTitle>
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <CreditCard className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-navy-900">₹{data?.stats?.paymentsReceived?.toLocaleString() || 0}</div>
                <p className="text-xs text-indigo-700 flex items-center mt-2 font-medium bg-indigo-50 w-fit px-2 py-0.5 rounded-full">
                  Total Revenue
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-navy-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden lg:col-span-1 xl:col-span-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <CardTitle className="text-sm font-medium text-navy-600">Pending Reviews</CardTitle>
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-navy-900">{data?.stats?.pendingReviews || 0}</div>
                <p className="text-xs text-amber-700 flex items-center mt-2 font-medium bg-amber-50 w-fit px-2 py-0.5 rounded-full">
                  Requires Admin Action
                </p>
              </CardContent>
            </Card>

          </div>

          <div className="grid gap-6 md:grid-cols-3 mt-6">
            {/* Dynamic Growth Chart */}
            <Card className="col-span-1 md:col-span-2 bg-white border-navy-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-primary-600" /> Platform Activity (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.chartData?.length > 0 ? (
                  <>
                    <div className="h-[250px] flex items-end justify-between gap-2 px-2 pt-8 pb-2 border-b border-navy-100 relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2 z-0">
                        <div className="border-b border-navy-50 w-full"></div>
                        <div className="border-b border-navy-50 w-full"></div>
                        <div className="border-b border-navy-50 w-full"></div>
                        <div className="border-b border-navy-50 w-full"></div>
                      </div>
                      
                      {/* Dynamic bars */}
                      {data.chartData.map((point: any, i: number) => {
                        // Calculate max value for scaling (min 10 so bars aren't tiny when data is low)
                        const maxVal = Math.max(10, ...data.chartData.map((d: any) => d.applications));
                        const appHeight = (point.applications / maxVal) * 100;
                        // Avoid division by zero
                        const approvalHeight = point.applications > 0 ? (point.approvals / point.applications) * 100 : 0;
                        
                        return (
                          <div key={i} className="w-full relative z-10 group flex flex-col items-center justify-end h-full group">
                            <div 
                              className="w-full max-w-[40px] bg-primary-100 rounded-t-sm relative transition-all duration-300 hover:opacity-80"
                              style={{ height: `${appHeight}%`, minHeight: appHeight > 0 ? '4px' : '0' }}
                              title={`${point.applications} Applications`}
                            >
                              <div 
                                className="absolute bottom-0 w-full bg-primary-500 rounded-t-sm transition-all duration-300" 
                                style={{ height: `${approvalHeight}%` }}
                                title={`${point.approvals} Approvals`}
                              ></div>
                            </div>
                            <span className="text-[10px] text-navy-400 mt-2 font-medium whitespace-nowrap">{point.date}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2 text-sm text-navy-600">
                        <div className="w-3 h-3 bg-primary-100 rounded-sm"></div> Applications
                      </div>
                      <div className="flex items-center gap-2 text-sm text-navy-600">
                        <div className="w-3 h-3 bg-primary-500 rounded-sm"></div> Approvals
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-navy-400 border border-dashed rounded-lg mt-4">
                    No activity data available for the last 7 days.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="col-span-1 bg-white border-navy-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 border-navy-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors" asChild>
                  <Link href="/admin/workspace">
                    <Building className="h-5 w-5 mr-3 text-primary-600" />
                    <div className="text-left">
                      <div className="font-semibold">Workspaces</div>
                      <div className="text-xs text-navy-500 font-normal">Manage batches & infra</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 border-navy-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors" asChild>
                  <Link href="/admin/progress">
                    <CheckSquare className="h-5 w-5 mr-3 text-emerald-600" />
                    <div className="text-left">
                      <div className="font-semibold">Weekly Progress</div>
                      <div className="text-xs text-navy-500 font-normal">Review submissions</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 border-navy-200 hover:bg-accent-50 hover:text-accent-700 hover:border-accent-200 transition-colors" asChild>
                  <Link href="/admin/certificates">
                    <Award className="h-5 w-5 mr-3 text-accent-600" />
                    <div className="text-left">
                      <div className="font-semibold">Certificates</div>
                      <div className="text-xs text-navy-500 font-normal">Generate credentials</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 border-navy-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors" asChild>
                  <Link href="/admin/tickets">
                    <LifeBuoy className="h-5 w-5 mr-3 text-red-600" />
                    <div className="text-left">
                      <div className="font-semibold">Support Desk</div>
                      <div className="text-xs text-navy-500 font-normal">Resolve student issues</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applicants */}
          <Card className="bg-white border-navy-100 shadow-sm mt-6">
            <CardHeader className="flex flex-row items-center justify-between border-b border-navy-50 pb-4">
              <div>
                <CardTitle className="text-lg">Recent Applications</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-800 hover:bg-primary-50" asChild>
                <Link href="/admin/applicants">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-navy-50">
                {data?.recentApplications?.length === 0 ? (
                  <div className="text-navy-400 text-sm text-center py-8">No recent applications found in the database.</div>
                ) : (
                  data?.recentApplications?.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between py-4 hover:bg-navy-50/50 px-2 rounded-lg transition-colors -mx-2">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border border-primary-200 flex items-center justify-center text-primary-900 font-bold uppercase shadow-sm">
                          {app.user.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-navy-900">{app.user.name}</div>
                          <div className="text-xs text-navy-500 flex items-center gap-1 mt-0.5">
                            <span className="font-medium text-navy-600">{app.internship.domain}</span>
                            <span>•</span>
                            <span>{app.internship.centre}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={
                        app.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100' : 
                        app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100' :
                        app.status === 'JOINED' ? 'bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-100' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100' :
                        'bg-navy-100 text-navy-800 border-navy-200 hover:bg-navy-100'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
