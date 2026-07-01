"use client"

import { useState } from "react"

import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, GraduationCap, Briefcase, Mail, Phone, MapPin, ExternalLink, AlertCircle, ShieldAlert, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import useSWR from "swr"
import { toast } from "sonner"
import Link from "next/link"

export default function CandidateReviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const { data, error, isLoading, mutate } = useSWR(`/api/admin/screening/${id}`)

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-1">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6 md:col-span-2">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data?.attempt) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-red-500 font-medium">Failed to load candidate details</div>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    )
  }

  const attempt = data.attempt
  const user = attempt.application.user
  const profile = user.candidateProfile

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(newStatus);
    try {
      const res = await fetch('/api/admin/applicants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: attempt.application.id, status: newStatus })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      toast.success(`Applicant moved to ${newStatus}`);
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsUpdating(null);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">Candidate Evaluation</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Attempt ID: {attempt.id}</span>
              <span>•</span>
              <Badge variant="outline">{attempt.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleUpdateStatus('INTERVIEW')}
            disabled={isUpdating !== null}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {isUpdating === 'INTERVIEW' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Shortlist for Interview
          </Button>
          <Button 
            onClick={() => handleUpdateStatus('REJECTED')}
            disabled={isUpdating !== null}
            variant="destructive"
          >
            {isUpdating === 'REJECTED' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Reject Candidate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Candidate Profile */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary-500" /> Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Full Name</div>
                <div className="font-medium">{user.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-slate-400" />
                  <a href={`mailto:${user.email}`} className="text-primary-600 hover:underline">{user.email}</a>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <span>{user.phone || 'N/A'}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>{profile?.city}, {profile?.state}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary-500" /> Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">College / University</div>
                <div className="font-medium">{user.college}</div>
                <div className="text-sm text-slate-600">{profile?.university}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Degree</div>
                  <div className="font-medium">{user.degree} in {user.branch}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Batch</div>
                  <div className="font-medium">{profile?.graduationYear}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">CGPA / Percentage</div>
                <div className="font-medium">{profile?.cgpa || 'N/A'}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary-500" /> Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Preferred Domain</div>
                <div className="font-medium">{profile?.preferredDomain || 'N/A'}</div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {attempt.application.resumeUrl && attempt.application.resumeUrl !== 'mock-resume-url.pdf' ? (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={attempt.application.resumeUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> View Resume
                    </a>
                  </Button>
                ) : (
                  <div className="text-sm text-slate-500 italic">No resume uploaded</div>
                )}
                
                {profile?.linkedinUrl && (
                  <Button variant="outline" className="w-full justify-start text-blue-600 hover:text-blue-700" asChild>
                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> LinkedIn Profile
                    </a>
                  </Button>
                )}
                
                {attempt.application.githubLink && (
                  <Button variant="outline" className="w-full justify-start text-slate-700 hover:text-black" asChild>
                    <a href={attempt.application.githubLink} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> GitHub Profile
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Assessment Results */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-primary-600 font-medium mb-1">Total Score</div>
                <div className="text-3xl font-bold text-primary-900">{attempt.score ?? '-'}</div>
                <div className="text-xs text-primary-700 mt-1">{attempt.percentage?.toFixed(1) ?? '0'}%</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-green-600 font-medium mb-1">Correct</div>
                <div className="text-3xl font-bold text-green-900">{attempt.correctCount ?? '-'}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-red-600 font-medium mb-1">Incorrect</div>
                <div className="text-3xl font-bold text-red-900">{attempt.wrongCount ?? '-'}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-slate-600 font-medium mb-1">Skipped</div>
                <div className="text-3xl font-bold text-slate-900">{attempt.skippedCount ?? '-'}</div>
              </CardContent>
            </Card>
          </div>

          {/* Security & Proctoring */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" /> Proctoring Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Warnings</span>
                  <span className={`text-xl font-bold ${attempt.warnings > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    {attempt.warnings}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Tab Switches</span>
                  <span className="text-xl font-bold text-slate-700">{attempt.tabSwitches}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Fullscreen Exits</span>
                  <span className="text-xl font-bold text-slate-700">{attempt.fullscreenExits}</span>
                </div>
              </div>
              
              {attempt.violations && attempt.violations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium border-b pb-1">Violation Log</h4>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {attempt.violations.map((v: any) => (
                      <li key={v.id} className="text-sm flex justify-between items-center bg-slate-50 px-3 py-2 rounded">
                        <span className="font-medium text-amber-700">{v.type}</span>
                        <span className="text-slate-500 text-xs">{new Date(v.timestamp).toLocaleTimeString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Question Review */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary-500" /> Detailed Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {attempt.answers.map((answer: any, idx: number) => {
                  const q = answer.question;
                  const isCorrect = answer.isCorrect;
                  const isSkipped = answer.selectedOption === null;
                  
                  if (!q) {
                    return (
                      <div key={answer.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-slate-500 italic">Q{idx + 1}. Question data unavailable</div>
                          <div>
                            {isSkipped ? (
                              <Badge variant="outline" className="bg-slate-100">Skipped</Badge>
                            ) : isCorrect ? (
                              <Badge variant="success" className="bg-green-100 text-green-800">Correct</Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-red-100 text-red-800">Incorrect</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-1 mt-4 text-sm">
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-32 shrink-0">Candidate Answer:</span>
                            <span className={`font-medium ${isSkipped ? 'text-slate-400 italic' : isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                              {answer.selectedOption || 'No answer provided'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={answer.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-navy-900">Q{idx + 1}. {q.question}</div>
                        <div>
                          {isSkipped ? (
                            <Badge variant="outline" className="bg-slate-100">Skipped</Badge>
                          ) : isCorrect ? (
                            <Badge variant="success" className="bg-green-100 text-green-800">Correct (+{q.marks})</Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">Incorrect (-{q.negativeMarks})</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1 mt-4 text-sm">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground w-32 shrink-0">Candidate Answer:</span>
                          <span className={`font-medium ${isSkipped ? 'text-slate-400 italic' : isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {answer.selectedOption || 'No answer provided'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground w-32 shrink-0">Correct Answer:</span>
                          <span className="font-medium text-slate-800">{q.correctAnswer}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {attempt.answers.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">No answers recorded for this attempt.</div>
                )}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}
