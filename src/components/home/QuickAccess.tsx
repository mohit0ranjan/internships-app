"use client";

import Link from "next/link";
import { LogIn, FileEdit, LineChart, ShieldCheck, Library } from "lucide-react";

export default function QuickAccess() {
  const actions = [
    { 
      title: "Apply Internship", 
      desc: "Submit new application",
      icon: <FileEdit className="w-5 h-5 text-accent-500" />,
      href: "/apply",
      bgHover: "hover:bg-orange-50"
    },
    { 
      title: "Student Login", 
      desc: "Access your workspace",
      icon: <LogIn className="w-5 h-5 text-primary-900" />,
      href: "/login",
      bgHover: "hover:bg-blue-50"
    },
    { 
      title: "Track Application", 
      desc: "Check selection status",
      icon: <LineChart className="w-5 h-5 text-emerald-600" />,
      href: "/track",
      bgHover: "hover:bg-green-50"
    },
    { 
      title: "Verify Certificate", 
      desc: "Validate credentials",
      icon: <ShieldCheck className="w-5 h-5 text-muted-foreground" />,
      href: "/verify",
      bgHover: "hover:bg-slate-50"
    },
    { 
      title: "Internship Domains", 
      desc: "Browse tech areas",
      icon: <Library className="w-5 h-5 text-muted-foreground" />,
      href: "#domains",
      bgHover: "hover:bg-slate-50"
    }
  ];

  return (
    <section className="py-12 bg-white relative z-20 -mt-8">
      <div className="container mx-auto px-6 lg:px-10">
        <h2 className="sr-only">Quick Portal Access</h2>
        
        {/* Unified Dashboard Panel */}
        <div className="bg-white border border-slate-300 shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {actions.map((action, index) => (
              <Link 
                href={action.href} 
                key={index}
                className={`flex flex-col p-6 transition-colors cursor-pointer group ${action.bgHover}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-background group-hover:shadow-sm transition-all border border-transparent group-hover:border-border">
                  {action.icon}
                </div>
                <h3 className="font-bold text-[15px] text-navy-900 mb-1">{action.title}</h3>
                <p className="text-[13px] text-slate-500">
                  {action.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
