"use client";

import { useState } from "react";
import useSWR from "swr";
import { CheckSquare, Calendar as CalendarIcon, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { data, error, isLoading } = useSWR(`/api/admin/attendance?date=${selectedDate}`, fetcher);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 ">Attendance Records</h1>
          <p className="text-navy-500  mt-1">View student check-ins across all batches.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-navy-600 ">Filter Date:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="border border-navy-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          />
        </div>
      </div>

      <Card className="border-navy-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" /> Daily Check-ins
          </CardTitle>
          <CardDescription>
            Showing records for {new Date(selectedDate).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-navy-400">Loading records...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">Failed to load records.</div>
          ) : data?.records?.length === 0 ? (
            <div className="text-center py-12 bg-navy-50 rounded-lg border border-dashed border-navy-200">
              <CalendarIcon className="w-12 h-12 text-navy-300 mx-auto mb-3" />
              <p className="text-navy-500 font-medium">No check-ins found</p>
              <p className="text-sm text-navy-400 mt-1">No students have marked attendance for this date.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-navy-50 text-navy-600 font-medium border-b border-navy-100">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Student</th>
                    <th className="px-4 py-3">Batch</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-lg">Check-in Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {data.records.map((record: any) => (
                    <tr key={record.id} className="hover:bg-navy-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                            {record.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-navy-900">{record.user.name}</p>
                            <p className="text-xs text-navy-400">{record.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {record.user.batches && record.user.batches.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {record.user.batches.map((b: any, i: number) => (
                              <Badge key={i} variant="outline" className="bg-white">
                                {b.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-navy-400 text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-navy-600 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-navy-400" />
                        {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
