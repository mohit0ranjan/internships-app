import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export default function ScreeningNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Branding */}
        <div className="flex items-center gap-6">
          <img src="/assets/img/csdac-navbar.png" alt="CSDAC Logo" className="h-20 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold leading-none text-navy-900 tracking-tight">CSDAC</span>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Screening Portal</span>
          </div>
        </div>

        {/* Security Badge / Info */}
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 border border-green-100 hidden sm:flex">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span className="text-xs font-semibold text-green-700">Proctored Environment</span>
        </div>

      </div>
    </header>
  )
}
