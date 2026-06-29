"use client";

import { Brain, ShieldAlert, Cloud, Cpu, Microchip, Wifi, Link2, Bot } from "lucide-react";
import Link from "next/link";

export default function Domains() {
  const domains = [
    { title: "Artificial Intelligence", icon: <Brain className="w-6 h-6 text-primary-900" />, bg: "bg-blue-100" },
    { title: "Cyber Security", icon: <ShieldAlert className="w-6 h-6 text-emerald-600" />, bg: "bg-green-100" },
    { title: "Cloud Computing", icon: <Cloud className="w-6 h-6 text-accent-500" />, bg: "bg-orange-100" },
    { title: "Quantum Computing", icon: <Cpu className="w-6 h-6 text-primary-900" />, bg: "bg-blue-100" },
    { title: "Robotics", icon: <Bot className="w-6 h-6 text-emerald-600" />, bg: "bg-green-100" },
    { title: "IoT", icon: <Wifi className="w-6 h-6 text-accent-500" />, bg: "bg-orange-100" },
    { title: "Embedded Systems", icon: <Microchip className="w-6 h-6 text-primary-900" />, bg: "bg-blue-100" },
    { title: "Blockchain", icon: <Link2 className="w-6 h-6 text-emerald-600" />, bg: "bg-green-100" },
  ];

  return (
    <section id="domains" className="py-20 bg-white border-t border-slate-200">
      <div className="container mx-auto px-6 lg:px-10 text-center">
        <h2 className="text-3xl font-bold text-primary-900 mb-3">Internship Domains</h2>
        <p className="text-muted-foreground text-[15px] max-w-2xl mx-auto mb-14">
          Select a research domain to view specific internship requirements, mentors, and ongoing projects.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {domains.map((domain, index) => (
            <Link 
              href={`/domains/${index}`} 
              key={index}
              className="relative flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-all group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-primary-900 transition-colors"></div>
              <div className={`w-14 h-14 rounded-full ${domain.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {domain.icon}
              </div>
              <h3 className="text-[14px] font-bold text-navy-900 group-hover:text-primary-900 transition-colors">
                {domain.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
