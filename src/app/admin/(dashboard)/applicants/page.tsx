"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MoreHorizontal, Download, FileText, Check, X, Loader2 } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

export default function ApplicantsPage() {
  const [filter, setFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  
  const { data, error, isLoading, mutate } = useSWR('/api/admin/applicants')

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/applicants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update status');
      
      toast.success(`Applicant status updated to ${newStatus}`);
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setUpdatingId(null);
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'SUBMITTED': return <Badge variant="outline">Submitted</Badge>;
      case 'SCREENING': return <Badge variant="secondary">Screening</Badge>;
      case 'INTERVIEW': return <Badge variant="secondary" className="bg-blue-100 text-blue-800  ">Interview</Badge>;
      case 'SELECTED': return <Badge variant="success">Selected</Badge>;
      case 'REJECTED': return <Badge variant="destructive">Rejected</Badge>;
      case 'OFFER_LETTER_SENT': return <Badge variant="default" className="bg-purple-500">Offer Sent</Badge>;
      case 'JOINED': return <Badge variant="default" className="bg-green-600">Joined</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  }

  const applicants = data?.applicants || [];
  
  let filteredApplicants = applicants;
  
  if (filter !== "ALL") {
    filteredApplicants = filteredApplicants.filter((a: any) => a.status === filter);
  }

  if (searchQuery) {
    filteredApplicants = filteredApplicants.filter((a: any) => 
      a.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.user.candidateProfile?.college && a.user.candidateProfile.college.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const handleExportCSV = () => {
    if (filteredApplicants.length === 0) {
      toast.error('No applicants to export');
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'College', 'Domain', 'Applied Date', 'Score', 'Status'];
    const rows = filteredApplicants.map((app: any) => [
      app.id,
      app.user.name,
      app.user.email,
      app.user.college || app.user.candidateProfile?.university || 'N/A',
      app.internship.domain,
      new Date(app.createdAt).toLocaleDateString(),
      app.screeningScore || 'Pending',
      app.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map((e: any[]) => e.map((cell: any) => `"${cell}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `applicants_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Applicant Management</h2>
          <p className="text-muted-foreground">Review, shortlist, and manage internship applications.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2 items-center flex-1">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search applicants..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <Button variant={filter === "ALL" ? "default" : "outline"} size="sm" onClick={() => setFilter("ALL")}>All</Button>
              <Button variant={filter === "SUBMITTED" ? "default" : "outline"} size="sm" onClick={() => setFilter("SUBMITTED")}>New</Button>
              <Button variant={filter === "SCREENING" ? "default" : "outline"} size="sm" onClick={() => setFilter("SCREENING")}>Screening</Button>
              <Button variant={filter === "INTERVIEW" ? "default" : "outline"} size="sm" onClick={() => setFilter("INTERVIEW")}>Interview</Button>
              <Button variant={filter === "SELECTED" ? "default" : "outline"} size="sm" onClick={() => setFilter("SELECTED")}>Selected</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Applicant Details</th>
                  <th className="px-4 py-3">College Name</th>
                  <th className="px-4 py-3">Domain</th>
                  <th className="px-4 py-3">Applied Date</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-red-500">Failed to load applicants</td>
                  </tr>
                ) : filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">No applicants found.</td>
                  </tr>
                ) : (
                  filteredApplicants.map((app: any) => (
                    <tr key={app.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <div className="font-medium text-navy-900 ">{app.user.name}</div>
                        <div className="text-xs text-muted-foreground">{app.user.email}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">ID: {app.id}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-700">{app.user.college || app.user.candidateProfile?.university || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{app.internship.domain}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        {app.screeningScore ? (
                          <Badge variant="outline" className={app.screeningScore >= 80 ? 'border-green-500 text-green-600' : ''}>
                            {app.screeningScore}/100
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Resume">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          
                          {app.status === 'SUBMITTED' || app.status === 'SCREENING' || app.status === 'INTERVIEW' ? (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-green-600 hover:text-green-700 hover:bg-green-50" 
                                title="Mark Selected"
                                onClick={() => handleUpdateStatus(app.id, 'SELECTED')}
                                disabled={updatingId === app.id}
                              >
                                {updatingId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                                title="Reject"
                                onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                disabled={updatingId === app.id}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
