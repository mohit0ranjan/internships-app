"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building, Copy, CheckCircle, Search, Mail, Loader2, RefreshCw, ChevronLeft, ChevronRight, Phone, Calendar, User, Eye, AlertCircle, Users } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function WorkspaceGenerationPage() {
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState(false)
  const [generatedCreds, setGeneratedCreds] = useState<{email: string, password: string, template: string, applicationId: string} | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Details Modal State
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null)

  const { data, error, isLoading, mutate } = useSWR('/api/admin/applicants?status=SELECTED')

  const handleGenerate = async (e: React.MouseEvent, appId: string) => {
    e.stopPropagation(); // Prevent opening modal when clicking button
    setLoadingAppId(appId);
    setGeneratedCreds(null);

    try {
      const res = await fetch('/api/admin/workspace/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: appId
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to generate workspace');
      }

      setGeneratedCreds({
        ...result.credentials,
        applicationId: appId
      });
      toast.success('Workspace generated successfully!');
      
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoadingAppId(null);
    }
  }

  const handleRegenerate = async () => {
    if (!generatedCreds?.applicationId) return;
    setRegenerating(true);

    try {
      const res = await fetch('/api/admin/workspace/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: generatedCreds.applicationId
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to regenerate credentials');
      }

      setGeneratedCreds({
        ...result.credentials,
        applicationId: generatedCreds.applicationId
      });
      toast.success('Password regenerated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setRegenerating(false);
    }
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${type} to clipboard`);
  }

  const applicants = data?.applicants || [];
  
  const filteredApplicants = applicants.filter((app: any) => 
    app.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const currentApplicants = filteredApplicants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Workspace Management</h2>
        <p className="text-muted-foreground">Generate workspace credentials for applicants who passed the offline test.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col h-[700px]">
          <CardHeader>
            <CardTitle>Selected Applicants</CardTitle>
            <CardDescription>Applicants pending workspace generation</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-9" 
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                <p>Loading applicants...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-red-500">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>Failed to load applicants</p>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg p-8 text-center bg-slate-50 ">
                <Users className="h-10 w-10 text-slate-300 mb-3" />
                <p className="font-medium text-slate-600">No applicants found</p>
                <p className="text-sm mt-1">
                  Make sure to mark applicants as &quot;SELECTED&quot; after they pass the test.
                </p>
              </div>
            ) : (
              currentApplicants.map((app: any) => (
                <div 
                  key={app.id} 
                  className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-navy-50/50  hover:border-primary-200 transition-all cursor-pointer shadow-sm bg-white"
                  onClick={() => setSelectedApplicant(app)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-navy-900 text-sm flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {app.user.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 ml-5">{app.user.email}</div>
                    </div>
                    <Badge variant="outline" className="bg-white">{app.status}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {app.user.phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {app.user.batches && app.user.batches.length > 0 
                        ? app.user.batches.map((b: any) => b.name).join(", ") 
                        : 'Unassigned Batch'}
                    </div>
                  </div>

                  <div className="text-xs mt-1 bg-slate-50  p-2 rounded border flex items-center justify-between">
                    <span><span className="font-semibold text-slate-700">Internship:</span> {app.internship.title}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                      <Eye className="w-3 h-3 text-slate-500" />
                    </Button>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full mt-1" 
                    onClick={(e) => handleGenerate(e, app.id)}
                    disabled={loadingAppId !== null}
                  >
                    {loadingAppId === app.id ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Building className="h-4 w-4 mr-2" /> Generate Workspace</>
                    )}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
          
          {totalPages > 1 && (
            <CardFooter className="border-t pt-4 flex items-center justify-between mt-auto">
              <div className="text-xs text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredApplicants.length)} of {filteredApplicants.length}
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center h-8 px-2 text-sm font-medium">
                  {currentPage} / {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>

        <Card className="h-fit sticky top-6">
          <CardHeader>
            <CardTitle>Generated Credentials</CardTitle>
            <CardDescription>Share these credentials with the student</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedCreds ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50  border border-green-200  rounded-lg flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 ">Workspace Ready!</h4>
                    <p className="text-sm text-green-700  mt-1">
                      Project environment established. The applicant&apos;s status is now &apos;JOINED&apos;.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Login Email (Username)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input readOnly value={generatedCreds.email} className="bg-muted/50 font-mono" />
                      <Button variant="outline" size="icon" onClick={() => handleCopy(generatedCreds.email, 'Username')} title="Copy Username">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Temporary Password</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input readOnly value={generatedCreds.password} className="bg-muted/50 font-mono" />
                      <Button variant="outline" size="icon" onClick={() => handleCopy(generatedCreds.password, 'Password')} title="Copy Password">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center justify-between">
                      Email Template
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleCopy(generatedCreds.template, 'Template')}>
                        <Copy className="h-3 w-3 mr-1" /> Copy All
                      </Button>
                    </label>
                    <textarea 
                      readOnly 
                      value={generatedCreds.template} 
                      className="mt-1 flex min-h-[200px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-mono shadow-sm focus-visible:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p>Select an applicant and click generate to view credentials here.</p>
                <p className="text-xs mt-2 max-w-[250px]">
                  Note: Since email delivery is skipped (per configuration), you must manually share these credentials with the student.
                </p>
              </div>
            )}
          </CardContent>
          {generatedCreds && (
            <CardFooter className="flex flex-col gap-2">
              <Button 
                variant="secondary" 
                className="w-full text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200" 
                onClick={handleRegenerate}
                disabled={regenerating}
              >
                {regenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Regenerate Password
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setGeneratedCreds(null)}>
                Clear & Generate Another
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Applicant Details Modal */}
      <Dialog open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
          </DialogHeader>
          
          {selectedApplicant && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                  {selectedApplicant.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-navy-900">{selectedApplicant.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedApplicant.user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Phone</p>
                  <p className="text-sm font-medium">{selectedApplicant.user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Status</p>
                  <Badge variant="outline" className="mt-1">{selectedApplicant.status}</Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Internship Program</p>
                  <p className="text-sm font-medium">{selectedApplicant.internship.title}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Assigned Batch</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedApplicant.user.batches && selectedApplicant.user.batches.length > 0 ? (
                      selectedApplicant.user.batches.map((b: any) => (
                        <Badge key={b.id} variant="secondary">{b.name}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground italic">No batch assigned</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Applied On</p>
                  <p className="text-sm font-medium">{new Date(selectedApplicant.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Screening Score</p>
                  <p className="text-sm font-medium">
                    {selectedApplicant.screeningScore !== null ? `${selectedApplicant.screeningScore}/100` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <Button type="button" variant="outline" onClick={() => setSelectedApplicant(null)}>Close</Button>
                <Button 
                  onClick={(e) => {
                    setSelectedApplicant(null);
                    handleGenerate(e, selectedApplicant.id);
                  }}
                  disabled={loadingAppId !== null}
                >
                  <Building className="w-4 h-4 mr-2" /> Generate Workspace
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
