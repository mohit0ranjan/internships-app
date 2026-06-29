"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, FileText, Eye, AlertCircle, Loader2 } from "lucide-react"
import useSWR from "swr"

export default function AdminScreeningPage() {
  const [filter, setFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const { data, error, isLoading } = useSWR('/api/admin/screening')

  const attempts = data?.attempts || [];
  
  let filtered = attempts;
  if (filter !== "ALL") {
    filtered = filtered.filter((a: any) => a.status === filter);
  }
  if (searchQuery) {
    filtered = filtered.filter((a: any) => 
      a.application.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.application.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'IN_PROGRESS': return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      case 'TIMEOUT': return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Timeout</Badge>;
      case 'TERMINATED': return <Badge variant="destructive">Terminated</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900">Screening Portal</h2>
          <p className="text-muted-foreground">Monitor candidates' assessment attempts and results.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2 items-center flex-1">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search candidates..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <Button variant={filter === "ALL" ? "default" : "outline"} size="sm" onClick={() => setFilter("ALL")}>All</Button>
              <Button variant={filter === "COMPLETED" ? "default" : "outline"} size="sm" onClick={() => setFilter("COMPLETED")}>Completed</Button>
              <Button variant={filter === "IN_PROGRESS" ? "default" : "outline"} size="sm" onClick={() => setFilter("IN_PROGRESS")}>Active</Button>
              <Button variant={filter === "TERMINATED" ? "default" : "outline"} size="sm" onClick={() => setFilter("TERMINATED")}>Terminated</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Candidate</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Started</th>
                  <th className="px-4 py-3">Warnings</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-red-500">Failed to load screening data</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">No records found.</td>
                  </tr>
                ) : (
                  filtered.map((attempt: any) => (
                    <tr key={attempt.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <div className="font-medium text-navy-900">{attempt.application.user.name}</div>
                        <div className="text-xs text-muted-foreground">{attempt.application.user.email}</div>
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {attempt.score !== null ? (
                          <span className={attempt.percentage >= 50 ? 'text-green-600' : 'text-red-600'}>
                            {attempt.score} / {attempt.percentage?.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Date(attempt.startTime).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        {attempt.warnings > 0 ? (
                          <span className="flex items-center text-amber-600 font-medium">
                            <AlertCircle className="w-4 h-4 mr-1" /> {attempt.warnings}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(attempt.status)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {attempt.application.resumeUrl && attempt.application.resumeUrl !== 'mock-resume-url.pdf' && (
                            <Button variant="ghost" size="icon" title="View Resume">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/screening/${attempt.id}`}>
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </Link>
                          </Button>
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
