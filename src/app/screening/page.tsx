"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowRight, Upload, AlertCircle, ShieldCheck, User, BookOpen, Briefcase } from "lucide-react"
import { toast } from "sonner"
import ScreeningSidebar from "@/components/screening/ScreeningSidebar"

export default function ScreeningRegistrationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [candidateId, setCandidateId] = useState("")
  
  // Generate a random session ID on mount
  useEffect(() => {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
    setCandidateId(`SESSION-${randomHex}`);
  }, []);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    university: "",
    branch: "",
    degree: "",
    currentYear: "",
    graduationYear: "",
    cgpa: "",
    preferredDomain: "",
    city: "",
    state: "",
    linkedin: "",
    github: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptedTerms) {
      toast.error("You must accept the declaration to proceed.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/screening/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success("Registration successful!")
      
      // Store in sessionStorage for the assessment flow
      sessionStorage.setItem('screening_app_id', data.applicationId)
      sessionStorage.setItem('screening_candidate_id', data.candidateId)
      
      router.push('/screening/instructions')
    } catch (error: unknown) {
      toast.error((error as Error).message || 'An error occurred during registration')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f3f4f6] font-sans">
      {/* Left Panel: Branding & Progress Sidebar */}
      <ScreeningSidebar currentStep={1} candidateId={candidateId} />

      {/* Right Panel: Form */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col overflow-y-auto h-screen p-6 lg:p-12 relative bg-white">
        
        {/* Mobile Header */}
        <div className="md:hidden flex flex-col items-center mb-8 w-full border-b pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3 h-3" /> Proctored Session
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidate Registration</h1>
        </div>

        <div className="max-w-3xl w-full mx-auto pb-20">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Personal Details */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">1</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Please provide your legal name and contact details.</p>
                </div>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                  <Input name="fullName" value={formData.fullName} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" placeholder="+91 9876543210" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">City <span className="text-red-500">*</span></label>
                    <Input name="city" value={formData.city} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">State <span className="text-red-500">*</span></label>
                    <Input name="state" value={formData.state} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" placeholder="MH" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Academic Details */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">2</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Academic Background</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Details about your current or past educational institution.</p>
                </div>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">College / Institution Name <span className="text-red-500">*</span></label>
                  <Input name="college" value={formData.college} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" placeholder="e.g. Indian Institute of Technology" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">University / Board <span className="text-red-500">*</span></label>
                  <Input name="university" value={formData.university} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" placeholder="e.g. Mumbai University" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Degree / Program <span className="text-red-500">*</span></label>
                  <Input name="degree" value={formData.degree} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" placeholder="e.g. B.Tech, MCA" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Branch / Specialization <span className="text-red-500">*</span></label>
                  <Input name="branch" value={formData.branch} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" placeholder="e.g. Computer Science" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Year <span className="text-red-500">*</span></label>
                    <select name="currentYear" value={formData.currentYear} onChange={handleChange} required className="w-full h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 px-3 text-sm">
                      <option value="">Select</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Grad <span className="text-red-500">*</span></label>
                    <Input name="graduationYear" value={formData.graduationYear} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 text-center" placeholder="2025" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">CGPA <span className="text-red-500">*</span></label>
                    <Input name="cgpa" value={formData.cgpa} onChange={handleChange} required className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 text-center" placeholder="8.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Professional Details */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">3</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Professional Preferences</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select your assessment domain and provide professional links.</p>
                </div>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Screening Domain <span className="text-red-500">*</span></label>
                  <select name="preferredDomain" value={formData.preferredDomain} onChange={handleChange} required className="w-full h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 px-3 text-sm">
                    <option value="">Select Primary Domain...</option>
                    <option value="Web Development (Frontend)">Web Development (Frontend)</option>
                    <option value="Web Development (Backend)">Web Development (Backend)</option>
                    <option value="Machine Learning / AI">Machine Learning / AI</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                    LinkedIn Profile <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Optional</span>
                  </label>
                  <Input name="linkedin" type="url" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                    GitHub Profile <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Optional</span>
                  </label>
                  <Input name="github" type="url" value={formData.github} onChange={handleChange} placeholder="https://github.com/username" className="h-11 rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900" />
                </div>
              </div>
            </div>

            {/* Step 4: Declaration & Submit */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden p-6 md:p-8">
              <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-5 mb-8 flex gap-4 text-amber-800">
                <AlertCircle className="h-6 w-6 shrink-0 text-amber-600 mt-0.5" />
                <div className="space-y-3">
                  <h4 className="text-base font-bold">Candidate Declaration</h4>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" required checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-600 cursor-pointer" />
                    <span className="text-sm leading-relaxed text-amber-700/90 group-hover:text-amber-900 transition-colors">
                      I declare that the information provided is accurate. I understand that this assessment is strictly proctored. Any attempt to navigate away, switch tabs, or use unauthorized assistance will result in immediate termination and disqualification.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Next Step:</span> Assessment Instructions
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !acceptedTerms}
                    className="h-11 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Provisioning Environment...</>
                    ) : (
                      <>Verify & Proceed <ArrowRight className="ml-1 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </div>

            </form>
          </div>

        
        <div className="text-center pb-8">
          <p className="text-xs text-slate-400 font-mono">
            SECURE PORTAL &copy; {new Date().getFullYear()} CSDAC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  )
}

