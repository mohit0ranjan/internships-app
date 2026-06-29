"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building, Copy, CheckCircle, Search, Mail, Loader2 } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

export default function WorkspaceGenerationPage() {
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null)
  const [generatedCreds, setGeneratedCreds] = useState<{email: string, password: string, template: string} | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const { data, error, isLoading, mutate } = useSWR('/api/admin/applicants?status=SELECTED')

  const handleGenerate = async (appId: string) => {
    setLoadingAppId(appId);
    setGeneratedCreds(null);

    try {
      const res = await fetch('/api/admin/workspace/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: appId,
          // Generate a default batch ID for now, in a real scenario you'd select this from a dropdown
          batchId: 'cm0abcdef0000000000000000'
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to generate workspace');
      }

      setGeneratedCreds(result.credentials);
      toast.success('Workspace credentials generated successfully!');
      
      // Refresh the list to remove the applicant who is now 'JOINED'
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoadingAppId(null);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  }

  const applicants = data?.applicants || [];
  
  const filteredApplicants = applicants.filter((app: any) => 
    app.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Workspace Management</h2>
        <p className="text-muted-foreground">Generate workspace credentials for applicants who passed the offline test.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Selected Applicants</CardTitle>
            <CardDescription>Applicants pending workspace generation</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm p-4 text-center">Failed to load applicants</div>
            ) : filteredApplicants.length === 0 ? (
              <div className="text-muted-foreground text-sm p-8 text-center border rounded-lg border-dashed">
                No pending applicants found. Make sure to mark applicants as &quot;SELECTED&quot; after they pass the test.
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredApplicants.map((app: any) => (
                  <div key={app.id} className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-navy-50  transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-sm">{app.user.name}</div>
                        <div className="text-xs text-muted-foreground">{app.user.email}</div>
                      </div>
                      <Badge variant="outline">{app.status}</Badge>
                    </div>
                    
                    <div className="text-xs mt-2 bg-white  p-2 rounded border">
                      <span className="font-semibold">Internship:</span> {app.internship.title}
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full mt-2" 
                      onClick={() => handleGenerate(app.id)}
                      disabled={loadingAppId !== null}
                    >
                      {loadingAppId === app.id ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                      ) : (
                        <><Building className="h-4 w-4 mr-2" /> Generate Workspace</>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
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
                    <h4 className="font-semibold text-green-900 ">Account Ready!</h4>
                    <p className="text-sm text-green-700  mt-1">
                      The portal account has been successfully generated. The applicant&apos;s status is now &apos;JOINED&apos;.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Login Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input readOnly value={generatedCreds.email} className="bg-muted/50 font-mono" />
                      <Button variant="outline" size="icon" onClick={() => handleCopy(generatedCreds.email)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Temporary Password</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input readOnly value={generatedCreds.password} className="bg-muted/50 font-mono" />
                      <Button variant="outline" size="icon" onClick={() => handleCopy(generatedCreds.password)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center justify-between">
                      Email Template
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleCopy(generatedCreds.template)}>
                        <Copy className="h-3 w-3 mr-1" /> Copy All
                      </Button>
                    </label>
                    <textarea 
                      readOnly 
                      value={generatedCreds.template} 
                      className="mt-1 flex min-h-[200px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-mono shadow-sm"
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
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setGeneratedCreds(null)}>
                Clear & Generate Another
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
