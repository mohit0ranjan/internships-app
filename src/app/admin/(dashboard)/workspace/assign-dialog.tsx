"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Loader2, RefreshCw, Save, Eye, EyeOff } from "lucide-react";


interface AssignWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string | null;
  onSuccess: () => void;
}

export function AssignWorkspaceDialog({ open, onOpenChange, applicationId, onSuccess }: AssignWorkspaceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applicant, setApplicant] = useState<any>(null);
  
  // Lists for dropdowns
  const [projects, setProjects] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    projectId: "",
    batchId: "",
    mentorId: "",
    internshipTitle: "",
    internshipType: "",
    internshipDuration: "",
    startDate: "",
    endDate: "",
    numberOfWeeks: "",
    workingDays: "",
    expectedCompletionDate: "",
    mode: "",
    certificateTitle: "",
    certificateProjectName: "",
    certificateDuration: "",
    certificateDescription: "",
    certificateSkills: "",
    certificateTechnologies: "",
    certificateIssueAuthority: "",
    certificateRemarks: ""
  });

  useEffect(() => {
    if (open && applicationId) {
      fetchData();
    } else {
      setApplicant(null);
      setPassword("");
    }
  }, [open, applicationId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, projRes, batchRes, mentorRes] = await Promise.all([
        fetch(`/api/admin/applicants/${applicationId}`),
        fetch(`/api/admin/projects`),
        fetch(`/api/admin/batches`),
        fetch(`/api/admin/mentors`)
      ]);
      
      if (!appRes.ok) throw new Error("Failed to load applicant");
      
      const appData = await appRes.json();
      const projData = await projRes.json();
      const batchData = await batchRes.json();
      const mentorData = await mentorRes.json();
      
      setApplicant(appData.applicant);
      setProjects(projData.projects || []);
      setBatches(batchData.batches || []);
      setMentors(mentorData.mentors || []);
      
      // Auto-fill some basics
      if (appData.applicant?.internship) {
        setFormData(prev => ({
          ...prev,
          internshipTitle: appData.applicant.internship.title || "",
          internshipDuration: appData.applicant.internship.duration || "",
          mode: appData.applicant.internship.mode || "",
        }));
      }

      if (appData.applicant?.workspaceAssignment) {
        setFormData(prev => ({
          ...prev,
          ...appData.applicant.workspaceAssignment,
          projectId: appData.applicant.workspaceAssignment.projectId || "",
          batchId: appData.applicant.workspaceAssignment.batchId || "",
          mentorId: appData.applicant.workspaceAssignment.mentorId || "",
          startDate: appData.applicant.workspaceAssignment.startDate ? appData.applicant.workspaceAssignment.startDate.split('T')[0] : "",
          endDate: appData.applicant.workspaceAssignment.endDate ? appData.applicant.workspaceAssignment.endDate.split('T')[0] : "",
          expectedCompletionDate: appData.applicant.workspaceAssignment.expectedCompletionDate ? appData.applicant.workspaceAssignment.expectedCompletionDate.split('T')[0] : ""
        }));
      }
    } catch (err) {
      toast.error("Could not load necessary data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value === "none" ? null : value }));
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0, n = charset.length; i < 12; ++i) {
      pwd += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(pwd);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/workspace/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: applicationId,
          password: password || undefined,
          ...formData
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign workspace");
      
      toast.success("Workspace updated successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Workspace Assignment & Control</DialogTitle>
          <DialogDescription>
            Configure the complete internship environment, assign resources, and manage credentials.
          </DialogDescription>
        </DialogHeader>

        {loading || !applicant ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto">
            <form id="workspace-form" onSubmit={handleSubmit} className="space-y-8 pb-10">
              
              {/* Credentials section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Login Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border">
                  <div className="space-y-2">
                    <Label>Username (Email)</Label>
                    <div className="flex gap-2">
                      <Input value={applicant.user.email} readOnly className="bg-white font-mono" />
                      <Button type="button" variant="outline" size="icon" onClick={() => handleCopy(applicant.user.email, 'Username')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="Enter or generate password" 
                          className="font-mono pr-10 bg-white" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button type="button" variant="secondary" onClick={generatePassword} title="Generate">
                        <RefreshCw className="w-4 h-4 mr-2" /> Generate
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={() => handleCopy(password, 'Password')} disabled={!password}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">If left blank, existing password remains unchanged.</p>
                  </div>
                </div>
              </div>

              {/* Resources section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Assignments</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Batch</Label>
                    <Select value={formData.batchId || "none"} onValueChange={(val) => handleSelectChange('batchId', val)}>
                      <SelectTrigger><SelectValue placeholder="Select a batch" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- No Batch --</SelectItem>
                        {batches.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Project</Label>
                    <Select value={formData.projectId || "none"} onValueChange={(val) => handleSelectChange('projectId', val)}>
                      <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- No Project --</SelectItem>
                        {projects.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mentor</Label>
                    <Select value={formData.mentorId || "none"} onValueChange={(val) => handleSelectChange('mentorId', val)}>
                      <SelectTrigger><SelectValue placeholder="Select a mentor" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- No Mentor --</SelectItem>
                        {mentors.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name} ({m.role})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Internship details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Internship Timeline & Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input name="internshipTitle" value={formData.internshipTitle || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input name="internshipType" value={formData.internshipType || ""} onChange={handleInputChange} placeholder="e.g. Industrial Training" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <Select value={formData.mode || "Offline"} onValueChange={(val) => handleSelectChange('mode', val)}>
                      <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration string</Label>
                    <Input name="internshipDuration" value={formData.internshipDuration || ""} onChange={handleInputChange} placeholder="e.g. 6 Months" />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input name="startDate" type="date" value={formData.startDate || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input name="endDate" type="date" value={formData.endDate || ""} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* Certificate Overrides */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Certificate Information (Overrides)</h3>
                <p className="text-xs text-muted-foreground -mt-2 mb-2">Used directly when generating the final certificate.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Certificate Title</Label>
                    <Input name="certificateTitle" value={formData.certificateTitle || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Project Name Override</Label>
                    <Input name="certificateProjectName" value={formData.certificateProjectName || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Technologies / Skills</Label>
                    <Input name="certificateTechnologies" value={formData.certificateTechnologies || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Issue Authority</Label>
                    <Input name="certificateIssueAuthority" value={formData.certificateIssueAuthority || ""} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

            </form>
          </div>
        )}

        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="workspace-form" disabled={saving || loading}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save & Generate Workspace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
