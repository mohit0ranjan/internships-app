"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, LogOut, LayoutDashboard, Briefcase, CheckSquare, Calendar as CalendarIcon, Download, Award, User, LifeBuoy } from "lucide-react";
import useSWR from "swr";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/student", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/student/internship", icon: Briefcase, label: "Internship Details" },
  { href: "/student/attendance", icon: CheckSquare, label: "Attendance" },
  { href: "/student/progress", icon: CheckSquare, label: "Weekly Progress" },
  { href: "/student/calendar", icon: CalendarIcon, label: "Calendar" },
  { href: "/student/notifications", icon: Bell, label: "Notifications", hasBadge: true },
  { href: "/student/downloads", icon: Download, label: "Downloads" },
  { href: "/student/certificate", icon: Award, label: "Certificate" },
  { href: "/student/profile", icon: User, label: "Profile" },
  { href: "/student/support", icon: LifeBuoy, label: "Support" },
];

export function StudentHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data } = useSWR('/api/notification');
  const unreadCount = data?.unreadCount || 0;

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-navy-900 truncate">Student Workspace</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/student/notifications" className="relative p-2 text-slate-500 hover:text-primary-900 transition-colors">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white p-4 h-full overflow-y-auto border-r border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-2">
              <span className="font-bold text-navy-900 flex items-center gap-2">
                <img src="/assets/img/cdacLogo.png" alt="CSDAC" className="h-6 w-6" />
                Workspace
              </span>
              <button onClick={() => setIsOpen(false)} className="p-1 text-slate-500 hover:text-primary-900">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/student" && pathname?.startsWith(item.href));
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
                      isActive 
                        ? "bg-primary-50 text-primary-700 font-bold" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-primary-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" /> {item.label}
                    </div>
                    {item.hasBadge && unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })} 
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
