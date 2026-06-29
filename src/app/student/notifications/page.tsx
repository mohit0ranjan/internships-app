"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Bell, CheckCircle, AlertCircle, Info, CheckCircle2 } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"
import { useState } from "react"

export default function NotificationsPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/notification')
  const [isMarking, setIsMarking] = useState(false)

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0

  const handleMarkAsRead = async (id?: string) => {
    setIsMarking(true)
    try {
      const payload = id ? { id } : { markAllRead: true }
      const res = await fetch('/api/notification', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to mark notification')
      mutate()
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setIsMarking(false)
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'SUCCESS': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'ERROR': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'WARNING': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default: return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">Failed to load notifications.</div>
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900  flex items-center gap-2">
            <Bell className="h-6 w-6" /> Notifications
          </h2>
          <p className="text-muted-foreground">Stay updated with alerts and messages.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={() => handleMarkAsRead()} disabled={isMarking}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y border-t mt-4">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No notifications to display.</p>
              </div>
            ) : (
              notifications.map((notif: any) => (
                <div 
                  key={notif.id} 
                  className={`p-6 flex items-start gap-4 transition-colors ${notif.isRead ? 'bg-white ' : 'bg-primary-50/50 '}`}
                >
                  <div className="shrink-0 mt-1">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${notif.isRead ? 'text-navy-900 ' : 'text-primary-900 '}`}>
                        {notif.title}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className={`text-sm ${notif.isRead ? 'text-muted-foreground' : 'text-primary-800 '}`}>
                      {notif.message}
                    </p>
                    
                    {!notif.isRead && (
                      <div className="pt-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => handleMarkAsRead(notif.id)} disabled={isMarking}>
                          Mark as read
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
