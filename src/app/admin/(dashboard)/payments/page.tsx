"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, Download, CreditCard } from "lucide-react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"

export default function PaymentsPage() {
  const { data, error, isLoading } = useSWR('/api/admin/payments')
  const [searchQuery, setSearchQuery] = useState("")

  const payments = data?.payments || [];
  
  const filteredPayments = payments.filter((p: any) => 
    p.application?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.application?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Payment Ledger</h2>
          <p className="text-muted-foreground">Audit student transactions and payment statuses.</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Ledger</Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, or transaction ID..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Student Details</th>
                  <th className="px-4 py-3">Internship Program</th>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-red-500">Failed to load payments.</td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p: any) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <div className="font-medium text-navy-900 ">{p.application?.user?.name || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">{p.application?.user?.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{p.application?.internship?.title}</div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs">
                        {p.transactionId || "-"}
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        â‚¹{p.amount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Badge variant={
                          p.status === 'SUCCESS' ? 'success' : 
                          p.status === 'PENDING' ? 'warning' : 'destructive'
                        }>
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
