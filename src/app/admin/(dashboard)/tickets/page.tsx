"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MessageSquare, LifeBuoy, Send, Check, Loader2 } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

export default function TicketsPage() {
  const [activeTicket, setActiveTicket] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  
  const { data, error, isLoading, mutate } = useSWR('/api/admin/tickets')

  const tickets = data?.tickets || []

  const handleReply = async () => {
    if (!replyMessage.trim() || !activeTicket) return;
    
    setIsReplying(true);
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticketId: activeTicket.id, 
          message: replyMessage,
          status: 'IN_PROGRESS'
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      toast.success('Reply sent successfully');
      setReplyMessage("");
      mutate();
      // Update local active ticket view
      setActiveTicket(result.ticket);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  }

  const handleResolve = async () => {
    if (!activeTicket) return;
    
    setIsResolving(true);
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticketId: activeTicket.id, 
          message: "Ticket has been marked as resolved by Administrator.",
          status: 'RESOLVED'
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      toast.success('Ticket marked as resolved');
      mutate();
      setActiveTicket(result.ticket);
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve ticket');
    } finally {
      setIsResolving(false);
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Support Tickets</h2>
        <p className="text-muted-foreground">Manage and resolve intern inquiries and issues.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ticket Queue</CardTitle>
            <div className="flex gap-2 items-center pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tickets..." className="pl-9 h-9" />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9"><Filter className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="px-3">
            <div className="space-y-2 h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : tickets.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No tickets found.</div>
              ) : (
                tickets.map((ticket: any) => (
                  <div 
                    key={ticket.id} 
                    className={`flex flex-col gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${activeTicket?.id === ticket.id ? 'border-primary-500 bg-primary-50 ' : 'hover:bg-navy-50 '}`}
                    onClick={() => setActiveTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium">{ticket.id.substring(0,8)}</span>
                      </div>
                      <Badge variant={getStatusColor(ticket.status) as any} className="text-xs">
                        {ticket.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div>
                      <div className="font-semibold text-sm truncate">{ticket.subject}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                        <span>{ticket.user.name}</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col min-h-[600px]">
          {activeTicket ? (
            <>
              <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{activeTicket.subject}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      Reported by <span className="font-medium text-navy-900 ">{activeTicket.user.name}</span>
                      <span className="text-muted-foreground">â€¢</span>
                      {activeTicket.user.email}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(activeTicket.status) as any}>{activeTicket.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 ">
                {activeTicket.messages.map((msg: any, i: number) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isFromAdmin ? 'items-end' : 'items-start'}`}>
                    <div className="text-xs text-muted-foreground mb-1 ml-1">
                      {msg.isFromAdmin ? 'Support Team' : activeTicket.user.name} â€¢ {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                    <div className={`p-3 rounded-lg max-w-[85%] text-sm ${
                      msg.isFromAdmin 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-white  border rounded-tl-none'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t p-4 flex flex-col gap-3">
                {activeTicket.status !== 'RESOLVED' ? (
                  <>
                    <div className="flex w-full items-center space-x-2">
                      <Input 
                        placeholder="Type your reply..." 
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                      />
                      <Button size="icon" onClick={handleReply} disabled={isReplying || !replyMessage.trim()}>
                        {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex w-full justify-between items-center">
                      <p className="text-xs text-muted-foreground">Replying will update status to In Progress.</p>
                      <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={handleResolve} disabled={isResolving}>
                        {isResolving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />} Mark as Resolved
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-full text-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    This ticket has been marked as resolved and is now closed.
                  </div>
                )}
              </CardFooter>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <LifeBuoy className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>Select a ticket from the queue to view details.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
