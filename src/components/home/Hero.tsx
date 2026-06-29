"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, FileCheck, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full bg-white border-b border-border overflow-hidden flex flex-col pt-12 pb-16">
      
      {/* Decorative Indian Flag Gradient Accent at the top */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent-500 via-white to-emerald-600"></div>
      
      {/* Subtle background glow */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-10 relative z-10 flex-grow">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Left column */}
          <div className="w-full lg:w-7/12 flex flex-col items-start relative z-20">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-primary-900 leading-[1.1] tracking-tight mb-4">
              Welcome to the CSDAC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-emerald-600">Internship Workspace</span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
              The official portal for students to apply, manage their workflow, communicate with mentors, and submit research projects under the Work-Based Learning Programme.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link href="/login" className="bg-primary-900 hover:bg-primary-950 text-white px-8 py-3 rounded text-[15px] font-bold transition-colors flex items-center gap-2">
                Login to Workspace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/apply" className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded text-[15px] font-bold transition-colors">
                Apply for Internship
              </Link>
            </div>

            {/* Government Trust Badges */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2 text-foreground text-sm font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Portal
              </div>
              <div className="flex items-center gap-2 text-foreground text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Research Driven
              </div>
              <div className="flex items-center gap-2 text-foreground text-sm font-semibold">
                <FileCheck className="w-4 h-4 text-emerald-600" /> National Programme
              </div>
            </div>
          </div>

          {/* Right column — India Map */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end relative z-10 hidden lg:flex">
             <img
              src="/assets/img/indiamap.svg"
              alt="India Map — WBL Host Centers"
              className="w-full max-w-[480px] h-auto object-contain relative z-10 opacity-90 drop-shadow-sm"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
