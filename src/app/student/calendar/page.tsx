"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { useState } from "react"

export default function CalendarPage() {
  const { data, error, isLoading } = useSWR('/api/student/attendance')
  const [currentDate, setCurrentDate] = useState(new Date())

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">Failed to load calendar data.</div>
  }

  const attendanceHistory = data?.history || []
  
  // Extract unique present dates in YYYY-MM-DD format local time
  const presentDates = new Set(
    attendanceHistory
      .filter((record: any) => record.status === 'PRESENT')
      .map((record: any) => new Date(record.date).toLocaleDateString('en-CA'))
  )

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const renderCalendar = () => {
    const days = []
    
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 border border-transparent"></div>)
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      const dateStr = d.toLocaleDateString('en-CA')
      const isPresent = presentDates.has(dateStr)
      const isToday = new Date().toLocaleDateString('en-CA') === dateStr

      days.push(
        <div 
          key={i} 
          className={`h-16 flex flex-col items-center justify-center border rounded-md transition-colors 
            ${isPresent ? 'bg-green-50 border-green-200  ' : 'bg-white  border-slate-100 '}
            ${isToday ? 'ring-2 ring-primary-500' : ''}
          `}
        >
          <span className={`text-sm font-medium ${isPresent ? 'text-green-700 ' : 'text-navy-900 '}`}>{i}</span>
          {isPresent && <CheckCircle2 className="h-3 w-3 text-green-500 mt-1" />}
        </div>
      )
    }

    return days
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Attendance Calendar</h2>
        <p className="text-muted-foreground">Visualize your presence and track your internship schedule.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary-500" /> {monthName}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Legend & Stats</CardTitle>
            <CardDescription>Understanding your calendar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50  rounded-lg border border-green-200 ">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white  shadow-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800 ">Present</p>
                <p className="text-xs text-green-700 ">Total: {data?.stats?.present || 0} days</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white  rounded-lg border">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100  shadow-sm text-muted-foreground">
                <span className="font-bold text-xs">-</span>
              </div>
              <div>
                <p className="text-sm font-semibold">Absent / Holiday</p>
                <p className="text-xs text-muted-foreground">Total: {data?.stats?.absent || 0} days</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Attendance Rule</h4>
              <p className="text-sm">You must maintain a minimum of <Badge variant="outline" className="text-primary-600 border-primary-200 bg-primary-50">75%</Badge> attendance across your enrolled days to be eligible for certificate generation.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
