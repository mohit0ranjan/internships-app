"use client";

import { Users, Building2, FlaskConical, Award } from "lucide-react";

export default function Stats() {
  const stats = [
    { value: "119K+", label: "Applications Processed", icon: <Users className="w-5 h-5" />, color: "text-accent-500" },
    { value: "4,213", label: "Active Interns", icon: <Award className="w-5 h-5" />, color: "text-white" },
    { value: "100+", label: "Research Labs", icon: <FlaskConical className="w-5 h-5" />, color: "text-emerald-600" },
    { value: "81", label: "Host Centres", icon: <Building2 className="w-5 h-5" />, color: "text-white" },
  ];

  return (
    <section className="bg-primary-900 border-t border-b border-slate-800">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-primary-950 py-10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center py-4 px-4 group">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/10 mb-4 group-hover:scale-110 transition-transform">
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <div className="text-white font-bold text-3xl lg:text-4xl tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
