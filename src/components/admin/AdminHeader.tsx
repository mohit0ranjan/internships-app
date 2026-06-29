"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/admin", label: "Analytics" },
  { href: "/admin/applicants", label: "Applicants" },
  { href: "/admin/screening", label: "Screening Portal" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/workspace", label: "Workspaces" },
  { href: "/admin/batches", label: "Batches" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/attendance", label: "Attendance" },
  { href: "/admin/progress", label: "Weekly Progress" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/tickets", label: "Support Tickets" },
  { href: "/admin/cms", label: "CMS" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-navy-900 truncate">Admin Console</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative p-2 text-slate-500 hover:text-primary-900 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white text-navy-900 p-4 h-full overflow-y-auto border-r border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-2">
              <span className="font-bold text-navy-900">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-1 text-slate-500 hover:text-primary-900">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm font-medium ${
                      isActive ? "bg-primary-50 text-primary-700 font-bold" : "text-slate-600 hover:bg-slate-100 hover:text-primary-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
