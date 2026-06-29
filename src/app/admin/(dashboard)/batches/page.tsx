"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Calendar, Users, Loader2, X } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select } from "@/components/ui/select"

export default function BatchesPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/batch')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    internshipId: "",
    startDate: "",
    endDate: "",
    status: "UPCOMING"
  })
  const [searchQuery, setSearchQuery] = useState("")

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to create batch');
      
      toast.success('Batch created successfully!');
      setIsModalOpen(false);
      setFormData({ name: "", internshipId: "", startDate: "", endDate: "", status: "UPCOMING" });
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const batches = data?.batches || [];
  const internships = data?.internships || [];
  
  const filteredBatches = batches.filter((b: any) => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.internship.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Batch Management</h2>
          <p className="text-muted-foreground">Manage training batches and date schedules.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Batch
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search batches..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
          ) : filteredBatches.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
              No batches found.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBatches.map((batch: any) => (
                <Card key={batch.id} className="border hover:border-primary-300  transition-colors shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="font-mono text-xs">{batch.name}</Badge>
                      <Badge variant={batch.status === "ONGOING" ? "success" : batch.status === "COMPLETED" ? "secondary" : "default"}>
                        {batch.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-base truncate" title={batch.internship.title}>{batch.internship.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" /> {batch._count?.students || 0} Students Enrolled
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" /> 
                      {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="batch-name" className="text-sm font-medium">Batch ID/Name</label>
                <Input id="batch-name" required placeholder="e.g. WBL-AI-2026-01" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label htmlFor="batch-internship" className="text-sm font-medium">Linked Internship</label>
                <Select 
                  id="batch-internship"
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="batch-start" className="text-sm font-medium">Start Date</label>
                  <Input id="batch-start" required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="batch-end" className="text-sm font-medium">End Date</label>
                  <Input id="batch-end" required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="batch-status" className="text-sm font-medium">Status</label>
                <Select 
                  id="batch-status"
                  required 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                </Select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Batch
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
