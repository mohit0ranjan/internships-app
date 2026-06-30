"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, GitBranch, FileText, MessageSquare, Check, X, Loader2 } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

import { Skeleton } from "@/components/ui/skeleton"

export default function ProgressReviewPage() {
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null)
  const [remarks, setRemarks] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data, error, isLoading, mutate } = useSWR('/api/admin/progress')

  const handleUpdate = async (status: string) => {
    if (!activeReviewId) return;
    
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          progressId: activeReviewId,
          status,
          adminRemarks: remarks.trim() || undefined
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update progress status');
      
      toast.success(`Progress marked as ${status}`);
      setActiveReviewId(null);
      setRemarks("");
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  }

  const submissions = data?.submissions || [];
  
  const pendingReviews = submissions.filter((s: any) => s.status === 'SUBMITTED' || s.status === 'NEEDS_REVISION');
  const filteredReviews = pendingReviews.filter((s: any) => 
    s.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.project?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeReview = pendingReviews.find((r: any) => r.id === activeReviewId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Weekly Progress Review</h2>
        <p className="text-muted-foreground">Review and approve intern weekly submissions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2 flex flex-col min-h-[600px]">
          <CardHeader className="pb-4 border-b shrink-0">
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>Submissions awaiting your feedback</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search intern or project..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-3">
            <div className="space-y-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </>
              ) : filteredReviews.length === 0 ? (
                <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                  <Check className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-50" />
                  No pending reviews found.
                </div>
              ) : (
                filteredReviews.map((review: any) => (
                  <div 
                    key={review.id} 
                    className={`flex flex-col gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${activeReviewId === review.id ? 'border-primary-500 bg-primary-50 ' : 'hover:bg-navy-50 '}`}
                    onClick={() => {
                      setActiveReviewId(review.id);
                      setRemarks("");
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-sm">{review.user.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{review.project?.title || "No Project"}</div>
                      </div>
                      <Badge variant="warning" className="text-xs shrink-0">Week {review.weekNumber}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Submitted: {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 min-h-[600px]">
          {activeReview ? (
            <Card className="shadow-md h-full flex flex-col">
              <CardHeader className="border-b bg-navy-50/50  pb-4 shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{activeReview.user.name}</CardTitle>
                    <CardDescription>{activeReview.project?.title || "No Project"}</CardDescription>
                  </div>
                  <Badge variant="default">Week {activeReview.weekNumber}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-1 overflow-y-auto space-y-6">
                
                <div>
                  <h4 className="text-sm font-semibold flex items-center mb-2">
                    <FileText className="mr-2 h-4 w-4 text-primary-600" />
                    Progress Summary
                  </h4>
                  <p className="text-sm bg-white  border rounded-md p-4 italic text-muted-foreground whitespace-pre-wrap">
                    &quot;{activeReview.summary}&quot;
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold flex items-center mb-2">
                    <GitBranch className="mr-2 h-4 w-4 text-primary-600" />
                    Repository Link
                  </h4>
                  {activeReview.githubUrl ? (
                    <div className="flex items-center gap-2">
                      <Input readOnly value={activeReview.githubUrl} className="font-mono text-xs bg-navy-50 " />
                      <Button variant="outline" size="sm" asChild>
                        <a href={activeReview.githubUrl} target="_blank" rel="noreferrer">Open</a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No link provided.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold flex items-center mb-2">
                    <MessageSquare className="mr-2 h-4 w-4 text-primary-600" />
                    Mentor Feedback
                  </h4>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-950 " 
                    placeholder="Provide constructive feedback on their progress..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  ></textarea>
                </div>
                
              </CardContent>
              <CardFooter className="bg-navy-50  border-t flex justify-between shrink-0 p-4">
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 " 
                  onClick={() => handleUpdate('REJECTED')}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />} 
                  Reject Report
                </Button>
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  onClick={() => handleUpdate('REVIEWED')}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} 
                  Approve Week {activeReview.weekNumber}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center border-dashed border-2">
              <FileText className="h-12 w-12 text-navy-200  mb-4" />
              <h3 className="text-lg font-semibold text-navy-900  mb-2">No Review Selected</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Select a pending weekly report from the list to review the summary, verify the code commit, and provide mentor feedback.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
