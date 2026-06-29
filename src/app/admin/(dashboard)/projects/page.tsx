"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Briefcase, UserPlus, Loader2, X, Code, MapPin } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"

export default function ProjectsPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/project')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    internshipId: "",
    mentorName: "",
    mentorEmail: "",
    techStack: ""
  })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [assignModalOpen, setAssignModalOpen] = useState<string | null>(null) // projectId
  const [assignAppId, setAssignAppId] = useState("")

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to create project');
      
      toast.success('Project created successfully!');
      setIsModalOpen(false);
      setFormData({ title: "", description: "", internshipId: "", mentorName: "", mentorEmail: "", techStack: "" });
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalOpen || !assignAppId) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/project', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: assignModalOpen, applicationId: assignAppId })
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to assign student');
      
      toast.success('Student assigned to project successfully!');
      setAssignModalOpen(null);
      setAssignAppId("");
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const projects = data?.projects || [];
  const internships = data?.internships || [];
  const unassignedStudents = data?.unassignedStudents || [];
  
  const filteredProjects = projects.filter((p: any) => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.mentorName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Project & Mentor Assignment</h2>
          <p className="text-muted-foreground">Create projects, assign mentors, and map students to them.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects or mentors..." 
              className="pl-9 bg-white " 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-white  text-muted-foreground">
              No projects found.
            </div>
          ) : (
            filteredProjects.map((project: any) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="bg-navy-50/50  border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription className="mt-1">{project.internship.title}</CardDescription>
                    </div>
                    <Badge variant={project.status === 'ACTIVE' ? 'success' : 'default'}>{project.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description || "No description provided."}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm border rounded-lg p-3 bg-slate-50 ">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Mentor</div>
                      <div className="font-medium">{project.mentorName || "Unassigned"}</div>
                      {project.mentorEmail && <div className="text-xs text-muted-foreground">{project.mentorEmail}</div>}
                    </div>
                    <div className="text-sm border rounded-lg p-3 bg-slate-50 ">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Tech Stack</div>
                      <div className="font-medium flex items-center gap-1">
                        <Code className="h-3 w-3" /> {project.techStack || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold">Assigned Students ({project.applications?.length || 0})</h4>
                      <Button variant="outline" size="sm" onClick={() => setAssignModalOpen(project.id)}>
                        <UserPlus className="h-3 w-3 mr-1" /> Assign
                      </Button>
                    </div>
                    {project.applications?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {project.applications.map((app: any) => (
                          <Badge key={app.id} variant="secondary" className="px-2 py-1">
                            {app.user.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic">No students assigned yet.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Unassigned Students</CardTitle>
              <CardDescription>Students who need a project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {isLoading ? (
                   <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : unassignedStudents.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center p-4">All students are assigned to projects.</div>
                ) : (
                  unassignedStudents.map((app: any) => (
                    <div key={app.id} className="text-sm border rounded p-2 hover:bg-slate-50  transition-colors">
                      <div className="font-medium">{app.user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{app.internship.title}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Project Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="proj-title" className="text-sm font-medium">Project Title</label>
                <Input id="proj-title" required placeholder="e.g. AI Healthcare Dashboard" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label htmlFor="proj-internship" className="text-sm font-medium">Linked Internship Program</label>
                <Select 
                  id="proj-internship"
                  required 
                  value={formData.internshipId}
                  onChange={e => setFormData({...formData, internshipId: e.target.value})}
                >
                  <option value="" disabled>Select Internship</option>
                  {internships.map((int: any) => (
                    <option key={int.id} value={int.id}>{int.title}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="proj-desc" className="text-sm font-medium">Description</label>
                <Textarea 
                  id="proj-desc"
                  placeholder="Brief description of the project goals..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="proj-tech" className="text-sm font-medium">Tech Stack</label>
                <Input id="proj-tech" placeholder="e.g. React, Python, PostgreSQL" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="proj-mentor-name" className="text-sm font-medium">Mentor Name</label>
                  <Input id="proj-mentor-name" placeholder="e.g. Dr. A. Kumar" value={formData.mentorName} onChange={e => setFormData({...formData, mentorName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="proj-mentor-email" className="text-sm font-medium">Mentor Email</label>
                  <Input id="proj-mentor-email" type="email" placeholder="mentor@cdac.in" value={formData.mentorEmail} onChange={e => setFormData({...formData, mentorEmail: e.target.value})} />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Student Modal */}
      <Dialog open={!!assignModalOpen} onOpenChange={(open) => !open && setAssignModalOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Student to Project</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <form onSubmit={handleAssign} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="assign-student" className="text-sm font-medium">Select Student</label>
                <Select 
                  id="assign-student"
                  required 
                  value={assignAppId}
                  onChange={e => setAssignAppId(e.target.value)}
                >
                  <option value="" disabled>Select from unassigned students</option>
                  {unassignedStudents.map((app: any) => (
                    <option key={app.id} value={app.id}>{app.user.name} ({app.internship.title})</option>
                  ))}
                </Select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAssignModalOpen(null)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || !assignAppId}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Assign Student
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
