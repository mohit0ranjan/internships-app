"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Users, Calendar, Settings, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    startDate: "",
    endDate: "",
    capacity: "",
    coordinator: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: "", code: "", startDate: "", endDate: "", capacity: "", coordinator: "" });
    setOpen(true);
  };

  const openEdit = (batch: any) => {
    setEditingId(batch.id);
    setFormData({
      name: batch.name,
      code: batch.code || "",
      startDate: batch.startDate ? batch.startDate.split('T')[0] : "",
      endDate: batch.endDate ? batch.endDate.split('T')[0] : "",
      capacity: batch.maxStudents ? String(batch.maxStudents) : (batch.capacity ? String(batch.capacity) : ""),
      coordinator: batch.coordinator || ""
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        maxStudents: formData.capacity, // Send as maxStudents for API compatibility
        id: editingId,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      };
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch('/api/admin/batch', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save batch");
      
      toast.success(editingId ? "Batch updated successfully!" : "Batch created successfully!");
      setOpen(false);
      setFormData({ name: "", code: "", startDate: "", endDate: "", capacity: "", coordinator: "" });
      fetchBatches();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;
    try {
      const res = await fetch(`/api/admin/batch?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete batch");
      toast.success("Batch deleted successfully");
      fetchBatches();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/admin/batch');
      const data = await res.json();
      setBatches(data.batches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-navy-900">Batch Management</h2>
          <p className="text-muted-foreground">Manage and assign reusable learning batches.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Batch" : "Create New Batch"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the details for this batch." : "Create a new cohort or batch for students to be assigned to."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Batch Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Summer 2026 Cohort" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Batch Code</Label>
                <Input id="code" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. SMR26" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} placeholder="e.g. 50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coordinator">Coordinator</Label>
                <Input id="coordinator" name="coordinator" value={formData.coordinator} onChange={handleInputChange} />
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? "Update Batch" : "Save Batch"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Batches</CardTitle>
          <CardDescription>View all active and historical batches.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No batches found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Coordinator</TableHead>
                    <TableHead>Assigned Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.name}</TableCell>
                      <TableCell>{batch.code || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(batch.startDate), "MMM d, yyyy")} - {format(new Date(batch.endDate), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>{batch.coordinator || "Unassigned"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {batch._count?.workspaceAssignments || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={batch.status === "ACTIVE" || batch.status === "ONGOING" ? "default" : "secondary"}>
                          {batch.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(batch)}>
                            <Edit className="w-4 h-4 text-navy-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(batch.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
