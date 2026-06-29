"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Save, User } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

export default function ProfilePage() {
  const { data, error, isLoading, mutate } = useSWR('/api/student/profile')
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    college: "",
    degree: "",
    branch: "",
    year: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (data?.user && !isEditing) {
      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
        college: data.user.college || "",
        degree: data.user.degree || "",
        branch: data.user.branch || "",
        year: data.user.year || "",
      })
    }
  }, [data, isEditing])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to update profile');
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
  }

  if (error || !data?.user) {
    return <div className="text-red-500 text-center py-10">Failed to load profile details.</div>
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Profile Details</h2>
        <p className="text-muted-foreground">Manage your personal and academic information.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4 text-primary-700 text-3xl font-bold uppercase shadow-sm">
                {data.user.name ? data.user.name.substring(0, 2) : <User className="h-10 w-10" />}
              </div>
              <h3 className="font-semibold text-lg">{data.user.name}</h3>
              <p className="text-sm text-muted-foreground">{data.user.email}</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Update your college and degree details.</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">College / University</label>
                  <Input 
                    value={formData.college} 
                    onChange={(e) => setFormData({...formData, college: e.target.value})} 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Degree</label>
                  <Input 
                    value={formData.degree} 
                    onChange={(e) => setFormData({...formData, degree: e.target.value})} 
                    disabled={!isEditing}
                    placeholder="B.Tech, MCA, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Branch / Specialization</label>
                  <Input 
                    value={formData.branch} 
                    onChange={(e) => setFormData({...formData, branch: e.target.value})} 
                    disabled={!isEditing} 
                    placeholder="Computer Science, IT, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year of Study</label>
                  <Input 
                    value={formData.year} 
                    onChange={(e) => setFormData({...formData, year: e.target.value})} 
                    disabled={!isEditing} 
                    placeholder="3rd Year, 4th Year, etc."
                  />
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving || !formData.name}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
