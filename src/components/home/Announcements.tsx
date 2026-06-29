"use client";

import Link from "next/link";
import { ArrowRight, Bell, FileText, Megaphone } from "lucide-react";

export default function Announcements() {
  const announcements = [
    { 
      type: "Result", 
      icon: <Bell className="w-5 h-5 text-emerald-600" />,
      title: "Winter 2026 Cohort Selection Results Announced", 
      date: "Oct 24, 2026",
      tag: "bg-green-100 text-green-800"
    },
    { 
      type: "Circular", 
      icon: <FileText className="w-5 h-5 text-primary-900" />,
      title: "Updated Guidelines for Final Project Submission", 
      date: "Oct 20, 2026",
      tag: "bg-blue-100 text-blue-800"
    },
    { 
      type: "Notification", 
      icon: <Megaphone className="w-5 h-5 text-accent-500" />,
      title: "Maintenance Downtime for Certificate Portal", 
      date: "Oct 18, 2026",
      tag: "bg-orange-100 text-orange-800"
    }
  ];

  return (
    <section id="announcements" className="py-20 bg-white border-t border-slate-200">
      <div className="container mx-auto px-6 lg:px-10">
        
        <div className="max-w-5xl mx-auto">
          {/* Official Government Notice Board Header */}
          <div className="bg-primary-900 rounded-t-xl px-8 py-5 flex flex-col md:flex-row items-center justify-between shadow-sm">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Official Announcements</h2>
              <p className="text-blue-200 text-sm">
                Latest updates, circulars, and results from the CSDAC Internship Cell.
              </p>
            </div>
            <Link href="/announcements" className="hidden md:flex items-center gap-1.5 text-white bg-background/10 hover:bg-background/20 px-4 py-2 rounded text-sm font-semibold transition-colors mt-4 md:mt-0 border border-white/20">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-slate-300 rounded-b-xl shadow-md overflow-hidden">
            <div className="divide-y divide-slate-200">
              {announcements.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col md:flex-row items-start md:items-center gap-5 px-8 py-6 hover:bg-navy-50 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    {item.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded ${item.tag}`}>
                        {item.type}
                      </span>
                      <span className="text-slate-500 text-xs font-semibold">{item.date}</span>
                    </div>
                    <h3 className="font-bold text-[16px] text-navy-900 group-hover:text-primary-900 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="hidden md:block shrink-0">
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-900 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile view all button */}
          <div className="mt-6 flex justify-center md:hidden">
            <Link href="/announcements" className="text-primary-900 font-bold text-sm hover:underline flex items-center gap-1">
              View All Announcements <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
