"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building, Search, Loader2, ChevronLeft, ChevronRight, Phone, Calendar, User, AlertCircle, Users, CheckCircle } from "lucide-react"
import useSWR from "swr"
import { AssignWorkspaceDialog } from "./assign-dialog"

export default function WorkspaceGenerationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Dialog State
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  
  const { data, error, isLoading, mutate } = useSWR('/api/admin/applicants?status=SELECTED,JOINED')

  const openAssignDialog = (appId: string) => {
    setSelectedAppId(appId)
    setAssignDialogOpen(true)
  }

  const handleDialogSuccess = () => {
    setAssignDialogOpen(false)
    setSelectedAppId(null)
    mutate()
  }

  const applicants = data?.applicants || [];
  
  const filteredApplicants = applicants.filter((app: any) => 
    app.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.internship?.title?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Workspace Assignment (Master Control)</h2>
        <p className="text-muted-foreground">Manage workspaces, allocate resources, and configure internships for students.</p>
      </div>

      <Card className="flex flex-col h-[750px]">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Students Directory</CardTitle>
              <CardDescription>Select a student to manage their complete workspace and resources.</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, internship..." 
                className="pl-9" 
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <p>Loading directory...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>Failed to load directory</p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg p-8 text-center bg-slate-50 ">
              <Users className="h-10 w-10 text-slate-300 mb-3" />
              <p className="font-medium text-slate-600">No students found</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {currentApplicants.map((app: any) => {
                const isAssigned = app.status === 'JOINED' || app.status === 'COMPLETED';
                return (
                  <div 
                    key={app.id} 
                    className={`flex flex-col gap-3 p-4 border rounded-xl transition-all cursor-pointer shadow-sm bg-white ${isAssigned ? 'border-green-200 bg-green-50/10 hover:bg-green-50/30' : 'hover:bg-navy-50/50 hover:border-primary-200'}`}
                    onClick={() => openAssignDialog(app.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-navy-900 text-[15px] flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400" /> {app.user.name}
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5 ml-5.5">{app.user.email}</div>
                      </div>
                      <Badge variant={isAssigned ? "default" : "outline"} className={isAssigned ? "bg-green-600" : "bg-white"}>
                        {isAssigned ? "ASSIGNED" : "PENDING"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {app.user.phone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {app.workspaceAssignment?.batch?.name || 'Unassigned Batch'}
                      </div>
                    </div>

                    <div className="text-xs mt-2 bg-slate-50 p-2.5 rounded-lg border flex items-center justify-between">
                      <span className="truncate"><span className="font-semibold text-slate-700">Internship:</span> {app.internship?.title}</span>
                    </div>

                    <Button 
                      size="sm" 
                      variant={isAssigned ? "outline" : "default"}
                      className="w-full mt-2 font-medium" 
                      onClick={(e) => {
                        e.stopPropagation();
                        openAssignDialog(app.id);
                      }}
                    >
                      {isAssigned ? (
                        <><CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Manage Assignment</>
                      ) : (
                        <><Building className="h-4 w-4 mr-2" /> Assign Workspace</>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
        
        {totalPages > 1 && (
          <CardFooter className="border-t pt-4 flex items-center justify-between mt-auto">
            <div className="text-sm text-muted-foreground">
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

      <AssignWorkspaceDialog 
        open={assignDialogOpen} 
        onOpenChange={setAssignDialogOpen} 
        applicationId={selectedAppId} 
        onSuccess={handleDialogSuccess} 
      />
    </div>
  )
}
