"use client";

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export default function Openings() {
  const openings = [
    { id: "INT-2026-01", title: "AI/ML Research Intern", centre: "Pune, HQ", duration: "6 Months", mode: "On-site", deadline: "15 Oct 2026" },
    { id: "INT-2026-02", title: "Cyber Security Analyst", centre: "Hyderabad", duration: "3 Months", mode: "Hybrid", deadline: "20 Oct 2026" },
    { id: "INT-2026-03", title: "HPC Systems Engineer", centre: "Bangalore", duration: "6 Months", mode: "On-site", deadline: "15 Oct 2026" },
    { id: "INT-2026-04", title: "Full Stack Developer", centre: "Delhi", duration: "6 Months", mode: "Remote", deadline: "30 Oct 2026" },
    { id: "INT-2026-05", title: "Quantum Computing Intern", centre: "Pune", duration: "6 Months", mode: "On-site", deadline: "05 Nov 2026" },
    { id: "INT-2026-06", title: "Embedded Systems Developer", centre: "Thiruvananthapuram", duration: "6 Months", mode: "On-site", deadline: "10 Nov 2026" }
  ];

  return (
    <section id="openings" className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 border-b border-slate-300 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 mb-2">Current Openings</h2>
            <p className="text-muted-foreground text-[15px]">
              Apply for active internship positions across various CSDAC centres nationwide.
            </p>
          </div>
          <Link href="/openings" className="hidden md:flex items-center gap-1.5 text-primary-600 font-bold text-sm hover:underline mt-4 md:mt-0">
            View All Openings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-background border border-slate-300 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-slate-50 border-b border-slate-300 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-24">Ref ID</th>
                  <th className="px-6 py-4">Position Title</th>
                  <th className="px-6 py-4">Centre</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {openings.map((opening, index) => (
                  <tr key={index} className="hover:bg-navy-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{opening.id}</td>
                    <td className="px-6 py-4 font-bold text-navy-900">{opening.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{opening.centre}</td>
                    <td className="px-6 py-4 text-muted-foreground">{opening.duration}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[11px] font-bold rounded-sm uppercase tracking-wider ${
                        opening.mode === 'Remote' ? 'bg-purple-100 text-purple-700' :
                        opening.mode === 'Hybrid' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {opening.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-red-600 font-medium text-xs">{opening.deadline}</td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/openings/${index}`} 
                        className="inline-flex items-center justify-center bg-primary-600 text-white px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-primary-700 transition-colors"
                      >
                        Apply
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Offline Application Form (PDF)
          </div>
          <Link href="/openings" className="md:hidden flex items-center gap-1.5 text-primary-600 font-bold text-sm hover:underline">
            View All Openings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
