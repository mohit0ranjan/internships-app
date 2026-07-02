"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, GitBranch, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

export default function ProgressPage() {
  const [githubUrl, setGithubUrl] = useState("")
  const [summary, setSummary] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data, error, isLoading, mutate } = useSWR('/api/student/progress')

  const currentWeek = data?.currentWeek || 1;
  const submissions = data?.progress || [];

  const handleSubmit = async () => {
    if (!summary.trim()) {
      toast.error('Please provide a progress summary');
      return;
    }

    if (!githubUrl.trim() || !githubUrl.includes('github.com')) {
      toast.error('Please provide a valid GitHub link');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekNumber: currentWeek,
          githubUrl: githubUrl.trim() || undefined,
          summary: summary.trim()
        })
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit report');
      
      toast.success(`Week ${currentWeek} report submitted successfully`);
      setGithubUrl("");
      setSummary("");
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'SUBMITTED': return 'default';
      case 'REVIEWED': return 'success';
      case 'NEEDS_REVISION': return 'destructive';
      default: return 'outline';
    }
  }

  // Find if current week is already submitted
  const hasSubmittedCurrentWeek = submissions.some((sub: any) => sub.weekNumber === currentWeek);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Weekly Progress</h2>
        <p className="text-muted-foreground">Submit your weekly reports and GitHub repository links.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit Week {currentWeek} Report</CardTitle>
            <CardDescription>Submit your progress for the current week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : hasSubmittedCurrentWeek ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-green-50  rounded-lg border border-green-200 ">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                <h3 className="font-semibold text-green-800 ">Report Submitted</h3>
                <p className="text-sm text-green-700  mt-1">You have already submitted your report for Week {currentWeek}. Next week will unlock on Monday.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub Commit/Repo Link <span className="text-red-500">*</span></label>
                  <div className="flex relative">
                    <GitBranch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="https://github.com/username/repo/commit/..." 
                      className="pl-9" 
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Link to the specific commit or PR for this week&apos;s work.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Progress Summary <span className="text-red-500">*</span></label>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-950 disabled:cursor-not-allowed disabled:opacity-50 " 
                    placeholder="Briefly describe what you accomplished this week, challenges faced, and what you plan to do next week..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  ></textarea>
                </div>
              </>
            )}
          </CardContent>
          {!hasSubmittedCurrentWeek && !isLoading && (
            <CardFooter>
              <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting || !summary.trim() || !githubUrl.trim()}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Weekly Report
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
            <CardDescription>Past reports and mentor remarks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : submissions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No past submissions found.</div>
              ) : (
                submissions.map((sub: any) => (
                  <div key={sub.id} className="flex flex-col gap-2 p-4 border rounded-lg bg-navy-50/50 ">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-sm">Week {sub.weekNumber}</div>
                      <Badge variant={getStatusColor(sub.status) as any} className="text-xs">
                        {sub.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">Submitted: {new Date(sub.submittedAt || Date.now()).toLocaleDateString()}</div>
                    <div className="text-sm mt-2 line-clamp-2 text-navy-800 ">{sub.summary}</div>
                    
                    {sub.githubLink && (
                      <div className="mt-2 text-xs flex items-center gap-1 text-primary-600 ">
                        <GitBranch className="h-3 w-3" />
                        <a href={sub.githubLink} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                          {sub.githubLink}
                        </a>
                      </div>
                    )}

                    {sub.adminRemarks && (
                      <div className="mt-3 p-3 bg-white  rounded border text-sm">
                        <span className="font-semibold text-xs text-muted-foreground mb-1 block">Mentor Remarks:</span>
                        {sub.adminRemarks}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
