"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Award, 
  LifeBuoy, 
  User, 
  LogOut,
  Calendar as CalendarIcon,
  Download,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
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

export function StudentSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const { data } = useSWR('/api/notification');
  const unreadCount = data?.unreadCount || 0;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:block shadow-sm relative z-20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 to-green-600"></div>
      <div className="h-16 flex items-center px-6 border-b border-slate-100 mt-1">
        <Link href="/" className="flex items-center gap-2">
          <img src="/assets/img/cdacLogo.png" alt="CSDAC" className="h-8 w-8 bg-white rounded-full p-1 border border-slate-200 shadow-sm" />
          <span className="font-bold text-navy-900">Workspace</span>
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
          <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase">
            Student Intern
          </span>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/student" && pathname?.startsWith(item.href));
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary-50 text-primary-700 font-bold" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-primary-900"
                )}
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
    </aside>
  );
}
