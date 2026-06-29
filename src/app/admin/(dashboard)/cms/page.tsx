"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Megaphone, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CMSPage() {
  const { data, error, isLoading, mutate } = useSWR("/api/admin/cms", fetcher);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    type: "INFO",
    isPublished: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create announcement");

      toast.success("Announcement created successfully");
      setIsOpen(false);
      setFormData({ title: "", body: "", type: "INFO", isPublished: true });
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading CMS...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load CMS data</div>;

  const announcements = data?.announcements || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 ">Content Management</h1>
          <p className="text-navy-500  mt-1">Manage homepage announcements and public content.</p>
        </div>
        
        <Button className="gap-2" onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4" /> New Announcement
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent onClose={() => setIsOpen(false)}>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Spring Batch 2026 Registration Open"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="type">Type</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="INFO">Information</option>
                  <option value="IMPORTANT">Important</option>
                  <option value="WARNING">Warning</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="body">Content (Markdown supported)</label>
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Announcement details..."
                  rows={4}
                  required
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300"
                />
                <label htmlFor="isPublished" className="text-sm">Publish immediately</label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-navy-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary-600" /> Announcements
          </CardTitle>
          <CardDescription>Content displayed on the public homepage.</CardDescription>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-12 bg-navy-50 rounded-lg border border-dashed border-navy-200">
              <Megaphone className="w-12 h-12 text-navy-300 mx-auto mb-3" />
              <p className="text-navy-500 font-medium">No announcements yet</p>
              <p className="text-sm text-navy-400 mt-1">Create one to show it on the homepage.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement: any) => (
                <div key={announcement.id} className="flex items-start justify-between p-4 bg-white border border-navy-100 rounded-lg shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-navy-900">{announcement.title}</h3>
                      <Badge variant="outline" className={
                        announcement.type === "IMPORTANT" ? "bg-accent-50 text-accent-700 border-accent-200" :
                        announcement.type === "WARNING" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-primary-50 text-primary-700 border-primary-200"
                      }>
                        {announcement.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-navy-600 line-clamp-2">{announcement.body}</p>
                    <p className="text-xs text-navy-400 pt-2">
                      Created on {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {announcement.isPublished ? (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-navy-500 bg-navy-100 px-2.5 py-1 rounded-full">
                        <XCircle className="w-4 h-4" /> Draft
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
