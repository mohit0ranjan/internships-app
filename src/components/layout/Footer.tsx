import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-navy-900">
      <div className="container mx-auto px-6 lg:px-10 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <img src="/assets/img/csdac-navbar.png" alt="CSDAC" className="h-8 w-auto object-contain opacity-80" />
            <span className="w-px h-4 bg-slate-300" />
            <span className="font-medium text-navy-900">CSDAC Internship Portal</span>
          </div>
          <div className="text-center md:text-right leading-relaxed">
            Designed, Deployed &amp; Maintained by Centre for Systems Development and Advanced Computing (CSDAC)
            <span className="mx-1.5 opacity-40">|</span>
            &copy; {new Date().getFullYear()} Work Based Learning. All rights reserved
            <span className="mx-1.5 opacity-40">|</span>
            <Link href="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
