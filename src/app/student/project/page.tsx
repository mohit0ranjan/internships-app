"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Link as LinkIcon, GitBranch, Globe, Server, CheckCircle2, Loader2, Save } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

export default function ProjectPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/student/project')
  
  const [githubUrl, setGithubUrl] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Sync state with data when it loads
  if (data?.project && !isEditing && (githubUrl === "")) {
    if (data.project.githubUrl) setGithubUrl(data.project.githubUrl)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/student/project', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          githubUrl: githubUrl.trim() || undefined
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      toast.success('Project URLs saved successfully');
      setIsEditing(false);
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save project URLs');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
  }

  if (error || !data) {
    return <div className="text-red-500 text-center py-10">Failed to load project details.</div>
  }

  const { internship, project } = data;

  if (!project) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Assigned Project</h2>
          <p className="text-muted-foreground">Details and submission links for your work-based learning project.</p>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No Project Assigned Yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Your mentor will assign you a live project shortly. Check back later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  let techStack = [];
  try {
    techStack = project.techStack ? JSON.parse(project.techStack) : [];
  } catch (e) {
    techStack = project.techStack ? project.techStack.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Assigned Project</h2>
        <p className="text-muted-foreground">Details and submission links for your work-based learning project.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="mb-2 bg-primary-100 text-primary-900 hover:bg-primary-200  ">{internship?.domain || 'General'}</Badge>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Project Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
              
              {techStack.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Required Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech: string, i: number) => (
                      <Badge key={i} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Project Repository & URLs</CardTitle>
                  <CardDescription>Update your project links here.</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Links</Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub Repository URL <span className="text-red-500">*</span></label>
                <div className="flex relative">
                  <GitBranch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="https://github.com/username/repo" 
                    className="pl-9" 
                    disabled={!isEditing}
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
                {isEditing && <p className="text-xs text-muted-foreground">Make sure the repository is public or you have invited your mentor.</p>}
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setGithubUrl(project.githubUrl || "");
                }}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mentor Details</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.mentor ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 font-bold uppercase">
                    {data.mentor.name.substring(0,2)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{data.mentor.name}</div>
                    <div className="text-xs text-muted-foreground">Technical Lead</div>
                    <a href={`mailto:${data.mentor.email}`} className="text-xs text-primary-600 hover:underline mt-1 block">
                      {data.mentor.email}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Mentor not assigned yet.</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary-50  border-primary-200 ">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary-600  shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-primary-900 ">Submission Guidelines</h4>
                  <p className="text-xs text-primary-800/80  mt-2 space-y-1">
                    â€¢ Code must be pushed to the main branch.<br/>
                    â€¢ Include a detailed README.md file.<br/>
                    â€¢ Ensure API keys are NOT hardcoded.<br/>
                    â€¢ The final evaluation will be based on the latest commit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
