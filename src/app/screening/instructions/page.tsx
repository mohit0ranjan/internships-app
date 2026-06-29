"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, CheckCircle2, ShieldAlert, Monitor, Wifi, Loader2 } from "lucide-react"
import { toast } from "sonner"
import ScreeningSidebar from "@/components/screening/ScreeningSidebar"

export default function AssessmentInstructionsPage() {
  const router = useRouter()
  const [appId, setAppId] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    const storedAppId = sessionStorage.getItem('screening_app_id')
    if (!storedAppId) {
      toast.error("Registration details not found. Please register first.")
      router.push('/screening')
    } else {
      setAppId(storedAppId)
    }
  }, [router])

  const handleStart = async () => {
    if (!appId) return
    setIsStarting(true)

    try {
      // Request fullscreen automatically on click
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch((err) => {
          console.warn(`Error attempting to enable fullscreen: ${err.message}`)
        })
      }

      const res = await fetch('/api/screening/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to start assessment")
      
      sessionStorage.setItem('screening_attempt_id', data.attemptId)
      router.push('/screening/assessment')
    } catch (error: unknown) {
      toast.error((error as Error).message)
      setIsStarting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f3f4f6] font-sans">
      <ScreeningSidebar currentStep={2} candidateId={appId || undefined} />

      {/* Right Panel: Content */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col overflow-y-auto h-screen p-6 lg:p-12 relative bg-white">
        
        <div className="md:hidden flex flex-col items-center mb-8 w-full border-b pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assessment Instructions</h1>
        </div>

        <div className="max-w-3xl w-full mx-auto pb-20 space-y-8">
          
          <div className="text-left space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Before You Begin</h1>
            <p className="text-slate-500 text-lg">Please read the examination rules carefully before provisioning your test environment.</p>
          </div>

          {/* Rules Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Assessment Rules</h3>
              </div>
            </div>
            <div className="p-6 md:p-8 bg-white">
              <ul className="space-y-4 text-slate-700">
                <li className="flex gap-4 items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Format</strong>
                    <span>The assessment consists of 20 Multiple Choice Questions (MCQs).</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Marking Scheme</strong>
                    <span>Standard questions carry 1 mark, hard questions carry 2 marks. There is a negative marking of 25% for every incorrect answer.</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Passing Criteria</strong>
                    <span>You must score at least 12 marks to be considered for the next round.</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Fullscreen Integrity</strong>
                    <span>This assessment requires fullscreen mode. Exiting fullscreen will be recorded as a violation. Exceeding 3 warnings will result in auto-submission.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-50/50 border border-amber-200 shadow-sm rounded-xl overflow-hidden p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-900/60 uppercase tracking-wider">Duration</p>
                    <p className="text-xl font-bold text-amber-900">30 Mins</p>
                  </div>
                </div>
                <div className="h-px bg-amber-200/50 w-full" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-900/60 uppercase tracking-wider">Environment</p>
                    <p className="text-sm font-semibold text-blue-900">Fullscreen Required</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-900/60 uppercase tracking-wider">Connection</p>
                    <p className="text-sm font-semibold text-green-900">Stable Internet</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center justify-center gap-2"
                onClick={handleStart}
                disabled={isStarting || !appId}
              >
                {isStarting ? (
                  <><Loader2 className="animate-spin h-5 w-5" /> Initializing Environment...</>
                ) : (
                  <>Start Assessment <ShieldAlert className="ml-1 h-5 w-5" /></>
                )}
              </Button>
              <p className="text-xs text-center text-slate-500 mt-4">By starting, you agree to the proctoring terms.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
