"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart, Users, Building, Briefcase, CheckSquare, 
  Award, CreditCard, LifeBuoy, Settings, LogOut, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", icon: BarChart, label: "Analytics" },
  { href: "/admin/applicants", icon: Users, label: "Applicants" },
  { href: "/admin/screening", icon: FileText, label: "Screening Portal" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/workspace", icon: Building, label: "Workspaces" },
  { href: "/admin/batches", icon: Users, label: "Batches" },
  { href: "/admin/projects", icon: Briefcase, label: "Projects" },
  { href: "/admin/attendance", icon: CheckSquare, label: "Attendance" },
  { href: "/admin/progress", icon: CheckSquare, label: "Weekly Progress" },
  { href: "/admin/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/tickets", icon: LifeBuoy, label: "Support Tickets" },
  { href: "/admin/cms", icon: FileText, label: "CMS" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:block shadow-sm relative z-20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 to-primary-600"></div>
      <div className="h-16 flex items-center px-6 border-b border-slate-100 mt-1">
        <Link href="/" className="flex items-center gap-2">
          <img src="/assets/img/cdacLogo.png" alt="CSDAC" className="h-8 w-8 bg-white rounded-full p-1 border border-slate-200 shadow-sm" />
          <span className="font-bold text-navy-900">Admin Console</span>
        </Link>
      </div>
      
      <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-6 px-3 py-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm font-bold text-navy-900 truncate">
            {user?.name}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {user?.email}
          </p>
          <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-accent-100 text-accent-700 border border-accent-200 uppercase">
            Administrator
          </span>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary-50 text-primary-700 font-bold" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-primary-900"
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
