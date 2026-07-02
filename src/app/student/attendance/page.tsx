"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

export default function AttendancePage() {
  const [time, setTime] = useState<Date | null>(null)
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  const { data, error, isLoading, mutate } = useSWR('/api/student/attendance')

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    try {
      const res = await fetch('/api/student/attendance', { method: 'POST' })
      const result = await res.json()
      
      if (!res.ok) throw new Error(result.error || 'Failed to mark attendance')
      
      toast.success('Attendance marked successfully!')
      mutate() // Refresh data
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setIsCheckingIn(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Attendance</h2>
        <p className="text-muted-foreground">Track your daily presence and check-in times.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Record today&apos;s presence</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="text-4xl font-bold text-navy-900  tabular-nums">
              {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </div>
            <p className="text-sm text-muted-foreground">
              {time ? time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '...'}
            </p>
            
            {data?.checkedInToday ? (
              <div className="w-full mt-4 p-3 bg-green-50  text-green-700  border border-green-200  rounded-lg flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Marked Present Today</span>
              </div>
            ) : (
              <Button size="lg" className="w-full mt-4" onClick={handleCheckIn} disabled={isCheckingIn || isLoading}>
                {isCheckingIn ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                Check In
              </Button>
            )}
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              Attendance records your timestamp in Indian Standard Time (IST).
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
            ) : error ? (
              <div className="text-red-500">Failed to load statistics.</div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-slate-50  border text-center">
                    <div className="text-2xl font-bold">{data?.stats?.totalDaysEnrolled || 0}</div>
                    <div className="text-xs text-muted-foreground">Days Enrolled</div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50  border border-green-100  text-center">
                    <div className="text-2xl font-bold text-green-700 ">{data?.stats?.present || 0}</div>
                    <div className="text-xs text-green-600 ">Present</div>
                  </div>
                  <div className="p-4 rounded-lg bg-red-50  border border-red-100  text-center">
                    <div className="text-2xl font-bold text-red-700 ">{data?.stats?.absent || 0}</div>
                    <div className="text-xs text-red-600 ">Absent</div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary-50  border border-primary-100  text-center">
                    <div className="text-2xl font-bold text-primary-700 ">{data?.stats?.percentage || 0}%</div>
                    <div className="text-xs text-primary-600 ">Percentage</div>
                  </div>
                </div>

                <div className="w-full bg-slate-100  rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full ${((data?.stats?.percentage || 0) >= 75) ? 'bg-green-600' : 'bg-red-600'}`} 
                    style={{ width: `${data?.stats?.percentage || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 75% attendance is required for certificate generation.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent History</CardTitle>
          <CardDescription>Your last 10 attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent ">
            {isLoading ? (
              <div className="flex justify-center p-4 relative z-10 bg-white "><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : data?.history?.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 relative z-10 bg-white ">No attendance records found.</div>
            ) : (
              data?.history?.map((record: any, index: number) => (
                <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                  
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white  bg-green-100 text-green-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-white  shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-navy-900  flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <Badge variant="success" className="text-xs">PRESENT</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Check In: {new Date(record.checkInTime || record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
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
