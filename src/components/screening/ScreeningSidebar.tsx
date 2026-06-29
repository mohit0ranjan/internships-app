import { ShieldCheck } from "lucide-react"

interface ScreeningSidebarProps {
  currentStep: number;
  candidateId?: string;
}

export default function ScreeningSidebar({ currentStep, candidateId }: ScreeningSidebarProps) {
  const steps = [
    {
      num: 1,
      title: "Verify Details",
      description: "Ensure all pre-filled information matches your academic records exactly."
    },
    {
      num: 2,
      title: "Read Instructions",
      description: "Review the strict proctoring guidelines and examination rules."
    },
    {
      num: 3,
      title: "Begin Assessment",
      description: "Enter the fullscreen environment and complete your test."
    },
    {
      num: 4,
      title: "Submission",
      description: "Assessment completed and securely recorded."
    }
  ];

  return (
    <div className="hidden md:flex w-full md:w-5/12 lg:w-1/2 bg-[#0f172a] p-10 lg:p-16 flex-col relative overflow-hidden border-r-4 border-blue-600">
      <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
        <img src="/assets/img/indiamap.svg" alt="" className="w-full h-full object-cover scale-110" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        
        <div className="mb-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="bg-white p-3 rounded-md inline-flex shadow-sm">
              <img src="/assets/img/csdac-navbar.png" alt="CSDAC Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-blue-900/50 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Proctored Session
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
            Candidate <br /><span className="text-blue-400">Portal</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Welcome to the official CSDAC Screening Assessment. Complete the stages below to securely provision and complete your evaluation environment.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {steps.map((step) => {
            const isActive = currentStep === step.num;
            const isPast = currentStep > step.num;
            const isFuture = currentStep < step.num;

            return (
              <div key={step.num} className={`flex items-start gap-4 transition-opacity ${isFuture ? 'opacity-40' : 'opacity-100'}`}>
                <div className={`w-8 h-8 rounded flex flex-shrink-0 items-center justify-center border 
                  ${isActive ? 'bg-blue-600 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 
                    isPast ? 'bg-green-500/20 border-green-500/50' : 
                    'bg-slate-800/50 border-slate-700'}`}
                >
                  <span className={`font-bold text-sm ${isActive ? 'text-white' : isPast ? 'text-green-400' : 'text-slate-400'}`}>
                    {step.num}
                  </span>
                </div>
                <div>
                  <h4 className={`font-semibold mb-1 ${isActive ? 'text-white' : isPast ? 'text-green-50' : 'text-slate-300'}`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-12">
          <div className="text-xs font-mono text-slate-500 mb-1">SESSION IDENTIFIER</div>
          <div className="text-sm font-mono text-slate-300 bg-slate-800/50 px-4 py-2 rounded border border-slate-700 inline-block">
            {candidateId || 'INIT-SESSION-39A4...'}
          </div>
        </div>
      </div>
    </div>
  );
}
