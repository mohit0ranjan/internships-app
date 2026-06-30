"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Clock, ShieldAlert, Flag, CheckCircle2, Maximize, Check } from "lucide-react"
import { toast } from "sonner"

type Question = {
  id: string;
  question: string;
  options: string[];
  difficulty: string;
  marks: number;
  selectedOption: string | null;
}

export default function AssessmentPage() {
  const router = useRouter()
  
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [warnings, setWarnings] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set())
  const [isFullscreen, setIsFullscreen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const fetchAssessment = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/screening/assessment?attemptId=${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setQuestions(data.questions)
      setTimeLeft(data.remainingTime)
      setWarnings(data.warnings)
      setLoading(false)
    } catch (error: any) {
      toast.error(error.message)
      if (error.message.includes('already COMPLETED')) {
        router.push('/screening/success')
      }
    }
  }, [router])

  const logViolation = useCallback(async (type: string) => {
    if (!attemptId) return
    try {
      const res = await fetch('/api/screening/violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, type })
      })
      const data = await res.json()
      if (res.ok) {
        setWarnings(data.warnings)
        if (data.terminated) {
          toast.error("Assessment terminated due to multiple violations.")
          router.push('/screening/success')
        } else {
          toast.warning(`Violation recorded (${type}). Warning ${data.warnings}/3.`)
        }
      }
    } catch (error) {
      console.error("Failed to log violation")
    }
  }, [attemptId, router])

  const handleSubmit = useCallback(async () => {
    if (!attemptId) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/screening/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId })
      })
      if (!res.ok) throw new Error("Failed to submit")
      
      // Exit fullscreen if needed
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(e => {})
      }
      
      toast.success("Assessment submitted successfully.")
      router.push('/screening/success')
    } catch (error: any) {
      toast.error(error.message)
      setIsSubmitting(false)
    }
  }, [attemptId, router])

  // Initialization
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      setIsFullscreen(true)
    }

    const storedAttemptId = sessionStorage.getItem('screening_attempt_id')
    if (!storedAttemptId) {
      toast.error("Assessment session not found.")
      router.push('/screening')
      return
    }
    setAttemptId(storedAttemptId)
    fetchAssessment(storedAttemptId)
  }, [router, fetchAssessment])

  // Security Monitoring
  useEffect(() => {
    if (loading || isSubmitting || !attemptId) return;

    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement
      setIsFullscreen(isFs)
      if (!isFs) {
        logViolation('FULLSCREEN_EXIT')
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [loading, isSubmitting, attemptId, logViolation])

  // Timer
  useEffect(() => {
    if (timeLeft === null || isSubmitting) return

    if (timeLeft <= 0) {
      handleSubmit()
      return
    }

    if (timeLeft === 600) toast.warning("10 minutes remaining!")
    if (timeLeft === 300) toast.warning("5 minutes remaining!")
    if (timeLeft === 60) toast.error("1 minute remaining!")

    const timer = setInterval(() => {
      setTimeLeft(prev => prev !== null ? prev - 1 : null)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isSubmitting, handleSubmit])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Interaction handlers
  const selectOption = async (option: string) => {
    const newQuestions = [...questions]
    newQuestions[currentIndex].selectedOption = option
    setQuestions(newQuestions)

    // Auto save
    if (attemptId) {
      fetch('/api/screening/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          questionId: questions[currentIndex].id,
          selectedOption: option
        })
      }).catch(console.error)
    }
  }

  const clearOption = () => {
    const newQuestions = [...questions]
    newQuestions[currentIndex].selectedOption = null
    setQuestions(newQuestions)

    // Auto save clear
    if (attemptId) {
      fetch('/api/screening/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          questionId: questions[currentIndex].id,
          selectedOption: null
        })
      }).catch(console.error)
    }
  }

  const toggleReview = () => {
    const qId = questions[currentIndex].id
    const newSet = new Set(markedForReview)
    if (newSet.has(qId)) newSet.delete(qId)
    else newSet.add(qId)
    setMarkedForReview(newSet)
  }

  const enterFullscreen = () => {
    if (containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        toast.error("Failed to enter fullscreen mode.")
      })
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
  }

  if (!isFullscreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="text-center space-y-6 max-w-md">
          <ShieldAlert className="h-16 w-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold">Fullscreen Required</h2>
          <p className="text-slate-300">This assessment must be taken in fullscreen mode to ensure integrity. Exiting fullscreen will result in a warning.</p>
          <Button onClick={enterFullscreen} size="lg" className="w-full h-12 text-lg">
            <Maximize className="mr-2 h-5 w-5" /> Enter Fullscreen
          </Button>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentIndex]
  const answeredCount = questions.filter(q => q.selectedOption).length

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#f3f4f6] font-sans select-none">
      
      {/* Assessment Content */}
      <div className="w-full flex flex-col h-screen overflow-hidden bg-white relative">
        
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 text-white h-20 flex items-center justify-between px-6 md:px-10 shrink-0 z-10 shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg hidden sm:block">
              <img src="/assets/img/csdac-navbar.png" alt="CSDAC Logo" className="h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-tight">CSDAC Assessment</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Screening Session</span>
            </div>
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-2 text-amber-400 bg-slate-800/50 px-4 py-2 rounded-lg font-mono text-lg font-bold border border-slate-700">
              <Clock className="h-5 w-5" />
              {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
            </div>
            {warnings > 0 && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/30 px-3 py-2 rounded-lg text-sm font-semibold border border-red-900/50">
                <ShieldAlert className="h-5 w-5" />
                Warn: {warnings}/3
              </div>
            )}
            <Button onClick={() => handleSubmit()} variant="default" size="lg" className="font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm px-6 h-12" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle2 className="h-5 w-5 mr-2" />} Submit Test
            </Button>
          </div>
        </header>

        {/* Main Layout (Split internally for Palette if space allows) */}
        <div className="flex flex-1 overflow-hidden flex-col xl:flex-row">
          
          {/* Question Area */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 flex flex-col max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Question {currentIndex + 1} <span className="text-slate-400 text-lg font-medium">/ {questions.length}</span></h2>
              <div className="flex gap-3 text-sm font-bold uppercase tracking-wider">
                <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-md">+{currentQ.marks} Marks</span>
              </div>
            </div>

            <Card className="flex-1 shadow-sm border border-slate-200 rounded-2xl mb-8 overflow-hidden">
              <div className="h-2 w-full bg-blue-600" />
              <CardContent className="p-8 md:p-10">
                <p className="text-xl text-slate-800 font-medium leading-relaxed mb-10 whitespace-pre-wrap">{currentQ.question}</p>
                
                <div className="space-y-4">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = currentQ.selectedOption === option
                    return (
                      <div 
                        key={idx}
                        onClick={() => selectOption(option)}
                        className={`flex items-start p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm ring-2 ring-blue-600/20' 
                            : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-5 transition-colors ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                        <span className={`text-lg leading-relaxed ${isSelected ? 'font-bold' : 'text-slate-700 font-medium'}`}>{option}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Action Bar */}
            <div className="flex items-center justify-between mt-auto pt-6">
              <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={toggleReview} className={`h-14 px-6 rounded-xl font-bold text-base transition-colors ${markedForReview.has(currentQ.id) ? 'bg-amber-100 border-amber-400 text-amber-900 hover:bg-amber-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}>
                  <Flag className="h-5 w-5 mr-2" /> {markedForReview.has(currentQ.id) ? 'Unmark Review' : 'Mark for Review'}
                </Button>
                <Button variant="ghost" size="lg" onClick={clearOption} disabled={!currentQ.selectedOption} className="h-14 px-6 text-base font-semibold text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100">
                  Clear
                </Button>
              </div>
              <div className="flex gap-4">
                <Button variant="secondary" size="lg" className="h-14 px-8 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-base transition-colors" onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))} size="lg" className="h-14 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-sm transition-colors" disabled={currentIndex === questions.length - 1}>
                  Next Question
                </Button>
              </div>
            </div>
          </div>

          {/* Question Palette (Bottom on small, Right on XL) */}
          <div className="xl:w-96 bg-white border-t xl:border-t-0 xl:border-l border-slate-200 shrink-0 flex flex-col xl:h-full max-h-72 xl:max-h-full shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-bold text-slate-900 text-lg">Question Palette</span>
              <span className="text-sm font-bold bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200">{answeredCount}/{questions.length}</span>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
              <div className="grid grid-cols-5 xl:grid-cols-4 gap-3">
                {questions.map((q, i) => {
                  const isAnswered = !!q.selectedOption
                  const isReview = markedForReview.has(q.id)
                  const isCurrent = i === currentIndex

                  let btnClass = "h-14 w-full text-base font-bold relative rounded-xl transition-all shadow-sm "
                  if (isCurrent) {
                    btnClass += "ring-4 ring-blue-500/50 ring-offset-2 border-blue-500 z-10 scale-105 "
                  }

                  if (isReview && isAnswered) {
                    btnClass += "bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700"
                  } else if (isReview) {
                    btnClass += "bg-amber-500 border-amber-600 text-white hover:bg-amber-600"
                  } else if (isAnswered) {
                    btnClass += "bg-green-600 border-green-700 text-white hover:bg-green-700"
                  } else {
                    btnClass += "bg-white text-slate-600 hover:bg-slate-100 border-2 border-slate-200"
                  }

                  return (
                    <Button 
                      key={q.id}
                      variant="outline"
                      className={btnClass}
                      onClick={() => setCurrentIndex(i)}
                    >
                      {i + 1}
                      {isAnswered && !isReview && (
                        <Check className="absolute bottom-1 right-1 h-3.5 w-3.5 text-white/80" />
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
            
            {/* Legend */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-2 text-[10px] uppercase font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-600" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" /> Review
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-white border border-slate-300" /> Unanswered
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
