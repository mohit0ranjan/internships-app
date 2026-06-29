"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function ScreeningSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6] font-sans">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white h-20 flex items-center justify-between px-6 md:px-10 shrink-0 shadow-md w-full">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg hidden sm:block">
            <img src="/assets/img/csdac-navbar.png" alt="CSDAC Logo" className="h-8 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight leading-tight">CSDAC Assessment</span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Screening Session</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="max-w-2xl w-full border border-slate-200 shadow-sm rounded-xl bg-white">
          <div className="border-b border-slate-200 px-8 py-6 bg-slate-50 flex items-center gap-4 rounded-t-xl">
            <div className="bg-green-600 rounded-full p-2 shrink-0">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Assessment Submitted Successfully</h1>
              <p className="text-slate-500 text-sm">Your responses and session logs have been securely recorded.</p>
            </div>
          </div>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Next Steps</h3>
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <ul className="space-y-4 text-slate-700">
                    <li className="flex gap-4 items-start">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex flex-col items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                      <span className="leading-relaxed text-sm">Our evaluation team will review your assessment scores and verify the proctoring logs for environment integrity.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex flex-col items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                      <span className="leading-relaxed text-sm">You will receive an official email update regarding your candidacy status within 3-5 business days.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex flex-col items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                      <span className="leading-relaxed text-sm">If your screening is successful, you will be invited to schedule a technical interview.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 gap-4">
                <span className="text-xs font-medium text-slate-400">You may safely close this browser tab.</span>
                <button 
                  onClick={() => window.close()}
                  className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto"
                >
                  Close Session
                </button>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
