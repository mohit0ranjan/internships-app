"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Award, Search, CheckCircle, Download, ExternalLink, Loader2, UserPlus } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { toast } from "sonner"

export default function CertificateGenerationPage() {
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'MANUAL'>('SYSTEM')
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null)
  const [isManualLoading, setIsManualLoading] = useState(false)
  const [generatedCert, setGeneratedCert] = useState<{id: string, name: string, number: string, qr: string} | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    studentName: "",
    college: "",
    degree: "",
    domain: "",
    duration: "",
    centre: "",
    projectName: "",
    technology: "",
    grade: "A+"
  })
  
  const { data, error, isLoading, mutate } = useSWR('/api/admin/certificate')

  const handleGenerateSystem = async (appId: string, name: string) => {
    setLoadingAppId(appId);
    try {
      const res = await fetch('/api/admin/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId })
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to generate certificate');
      
      setGeneratedCert({
        id: result.certificate.id,
        name: name,
        number: result.certificate.certificateNumber,
        qr: result.certificate.qrCode
      });
      toast.success('Certificate generated successfully!');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoadingAppId(null);
    }
  }

  const handleGenerateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsManualLoading(true);
    try {
      const res = await fetch('/api/admin/certificate/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to generate certificate manually');
      
      setGeneratedCert({
        id: result.certificate.id,
        name: manualForm.studentName,
        number: result.certificate.certificateNumber,
        qr: result.certificate.qrCode
      });
      toast.success('Manual certificate generated successfully!');
      
      // Reset form
      setManualForm({
        studentName: "", college: "", degree: "", domain: "", 
        duration: "", centre: "", projectName: "", technology: "", grade: "A+"
      });
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsManualLoading(false);
    }
  }

  const eligibleInterns = data?.eligibleInterns || [];
  const filteredInterns = eligibleInterns.filter((app: any) => 
    app.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900">Certificate Generation</h2>
        <p className="text-muted-foreground">Generate verifiable QR-enabled certificates for interns.</p>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <Button 
          variant={activeTab === 'SYSTEM' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('SYSTEM')}
          className="gap-2"
        >
          <Award className="w-4 h-4" /> System Enrolled
        </Button>
        <Button 
          variant={activeTab === 'MANUAL' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('MANUAL')}
          className="gap-2"
        >
          <UserPlus className="w-4 h-4" /> Manual Generation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {activeTab === 'SYSTEM' ? (
          <Card className="flex flex-col min-h-[600px]">
            <CardHeader className="shrink-0">
              <CardTitle>Eligible Interns</CardTitle>
              <CardDescription>Interns eligible for certificate generation (Completed / Joined)</CardDescription>
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
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : filteredInterns.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                    No eligible interns found.
                  </div>
                ) : (
                  filteredInterns.map((app: any) => (
                    <div key={app.id} className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-navy-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{app.user.name}</div>
                          <div className="text-xs text-muted-foreground">{app.user.email}</div>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Eligible</Badge>
                      </div>
                      
                      <div className="text-xs bg-white p-2 rounded border mt-2">
                        <div className="text-muted-foreground mb-1">Internship Domain</div>
                        <div className="font-semibold text-navy-600">{app.internship.domain}</div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="mt-2 w-full flex items-center justify-center gap-2"
                        onClick={() => handleGenerateSystem(app.id, app.user.name)}
                        disabled={loadingAppId !== null}
                      >
                        {loadingAppId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />} 
                        Issue Certificate
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col min-h-[600px]">
            <CardHeader className="shrink-0 border-b">
              <CardTitle>Manual Generation</CardTitle>
              <CardDescription>Generate a certificate for someone not registered in the system.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              <form id="manualForm" onSubmit={handleGenerateManual} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Student Name *</label>
                  <Input required placeholder="e.g. John Doe" value={manualForm.studentName} onChange={(e) => setManualForm({...manualForm, studentName: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">College/Institution</label>
                    <Input placeholder="e.g. IIT Delhi" value={manualForm.college} onChange={(e) => setManualForm({...manualForm, college: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Degree</label>
                    <Input placeholder="e.g. B.Tech CSE" value={manualForm.degree} onChange={(e) => setManualForm({...manualForm, degree: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium">Internship Domain *</label>
                  <Input required placeholder="e.g. Full Stack Web Development" value={manualForm.domain} onChange={(e) => setManualForm({...manualForm, domain: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration *</label>
                    <Input required placeholder="e.g. 15 May 2026 - 15 Jul 2026" value={manualForm.duration} onChange={(e) => setManualForm({...manualForm, duration: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Centre</label>
                    <Input placeholder="e.g. C-DAC Delhi" value={manualForm.centre} onChange={(e) => setManualForm({...manualForm, centre: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium">Project Name</label>
                  <Input placeholder="e.g. E-Commerce Dashboard" value={manualForm.projectName} onChange={(e) => setManualForm({...manualForm, projectName: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Technology</label>
                    <Input placeholder="e.g. React, Node.js" value={manualForm.technology} onChange={(e) => setManualForm({...manualForm, technology: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Performance Grade</label>
                    <Input placeholder="e.g. A+" value={manualForm.grade} onChange={(e) => setManualForm({...manualForm, grade: e.target.value})} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t p-4 shrink-0 bg-navy-50">
              <Button type="submit" form="manualForm" className="w-full" disabled={isManualLoading}>
                {isManualLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Award className="h-4 w-4 mr-2" />} 
                Generate Manual Certificate
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="min-h-[600px]">
          {generatedCert ? (
            <Card className="border-navy-200 shadow-lg overflow-hidden h-full flex flex-col">
              <div className="bg-navy-600 p-1 shrink-0"></div>
              <CardHeader className="bg-white pb-4 shrink-0 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                    <CardTitle>Certificate Issued!</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setGeneratedCert(null)}>Close</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-1 flex items-center justify-center bg-slate-50">
                
                <div className="w-full max-w-sm border-2 border-navy-100 rounded-lg p-6 flex flex-col items-center justify-center text-center relative bg-white shadow-sm">
                  <div className="relative z-10 space-y-6 w-full">
                    <img src="/assets/img/cdacLogo.png" alt="CSDAC" className="h-12 mx-auto" />
                    
                    <div>
                      <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Certificate of Completion</h4>
                      <div className="text-2xl font-bold font-serif text-navy-900">
                        {generatedCert.name}
                      </div>
                    </div>
                    
                    <div className="flex justify-center my-6">
                      <img src={generatedCert.qr} alt="Verification QR" className="h-28 w-28 p-1.5 bg-white border shadow-sm rounded" />
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Certificate No.</div>
                      <div className="text-sm font-mono font-bold text-navy-900">
                        {generatedCert.number}
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-navy-50 border-t flex gap-2 shrink-0 p-4">
                <Button className="flex-1" variant="outline">
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
                <Button className="flex-1 bg-navy-900 hover:bg-navy-800 text-white" asChild>
                  <Link href={`/verify/${generatedCert.number}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" /> Verify Page
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center border-dashed border-2">
              <div className="h-16 w-16 rounded-full bg-navy-50 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-navy-300" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Issue Certificates</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Generate unique certificate numbers and verifiable QR codes securely in the database.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
