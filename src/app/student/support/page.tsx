"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LifeBuoy, MessageSquare, Plus, CheckCircle2, Loader2, Send, Clock } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

export default function SupportPage() {
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data, error, isLoading, mutate } = useSWR('/api/student/support')
  const tickets = data?.tickets || []

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Subject and message are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/student/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: subject.trim(),
          message: message.trim()
        })
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create ticket');
      
      toast.success('Support ticket created successfully');
      setSubject("");
      setMessage("");
      setShowNewTicket(false);
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return "destructive";
      case 'IN_PROGRESS': return "warning";
      case 'RESOLVED': return "success";
      default: return "default";
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Support & Help Desk</h2>
          <p className="text-muted-foreground">Raise tickets for technical or administrative assistance.</p>
        </div>
        <Button onClick={() => setShowNewTicket(!showNewTicket)}>
          {showNewTicket ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> New Ticket</>}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {showNewTicket ? (
          <Card className="md:col-span-3 border-primary-200  shadow-md animate-in fade-in slide-in-from-top-4">
            <CardHeader className="bg-primary-50/50  border-b">
              <CardTitle>Create New Support Ticket</CardTitle>
              <CardDescription>Provide details about the issue you are facing.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 max-w-2xl">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject <span className="text-red-500">*</span></label>
                <Input 
                  placeholder="Brief description of the issue" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message <span className="text-red-500">*</span></label>
                <textarea 
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-950 " 
                  placeholder="Please describe your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting || !subject.trim() || !message.trim()} className="mt-2">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Ticket
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <LifeBuoy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p>You haven&apos;t created any support tickets yet.</p>
                </div>
              ) : (
                tickets.map((ticket: any) => (
                  <div key={ticket.id} className="flex flex-col gap-3 p-4 border rounded-lg bg-white  shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-medium text-muted-foreground">{ticket.id.substring(0,8)}</span>
                          <span className="text-xs text-muted-foreground">â€¢</span>
                          <span className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="font-semibold text-navy-900 ">{ticket.subject}</div>
                      </div>
                      <Badge variant={getStatusColor(ticket.status) as any}>{ticket.status.replace("_", " ")}</Badge>
                    </div>
                    
                    <div className="pl-4 border-l-2 space-y-4 mt-2 border-muted">
                      {ticket.messages.map((msg: any) => (
                        <div key={msg.id} className="text-sm">
                          <div className="font-medium text-xs mb-1 flex items-center gap-2">
                            {msg.isFromAdmin ? (
                              <span className="text-primary-600 ">Support Team</span>
                            ) : (
                              <span className="text-muted-foreground">You</span>
                            )}
                            <span className="text-muted-foreground font-normal text-xs">{new Date(msg.createdAt).toLocaleString()}</span>
                          </div>
                          <div className={`p-3 rounded-lg inline-block ${msg.isFromAdmin ? 'bg-primary-50  text-primary-900 ' : 'bg-muted/50'}`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Support Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3 items-start">
              <MessageSquare className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <p>Before raising a ticket, please check the FAQ section for common issues.</p>
            </div>
            <div className="flex gap-3 items-start">
              <Clock className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <p>Typical response time is 24-48 working hours.</p>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <p>Once your issue is resolved, the ticket will be closed automatically by the admin.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
