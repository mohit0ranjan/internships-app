'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { AlertCircle, ShieldCheck, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/workspace';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError('Invalid administrative credentials');
        setLoading(false);
      } else if (res?.url) {
        router.push(res.url);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* Left Panel: Branding & Trust (Admin Slate) */}
      <div className="hidden md:flex w-full md:w-5/12 lg:w-1/2 bg-slate-50 p-10 lg:p-16 flex-col relative overflow-hidden border-r border-slate-200">
        {/* Subtle Map Background */}
        <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center pointer-events-none">
          <img src="/assets/img/indiamap.svg" alt="" className="w-full h-full object-contain scale-150" />
        </div>

        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0056b3]"></div>

        <div className="relative z-10 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-primary-900 transition-colors text-sm font-semibold mb-16 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Public Portal
          </Link>

          <div className="flex items-center gap-4 mb-10">
            <img src="/assets/img/csdac-navbar.png" alt="CSDAC" className="h-16 w-16 object-contain" />
            <div className="h-10 w-px bg-slate-300"></div>
            <span className="text-xl font-bold text-navy-900 tracking-wide">CSDAC</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-navy-900 leading-[1.15] tracking-tight mb-6">
            Administrator <br />
            <span className="text-[#0056b3]">Control Center</span>
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed max-w-md mb-12">
            This is a restricted access area. Authorized CSDAC scientists, administrators, and mentors only.
          </p>

          {/* Trust Badges */}
          <div className="mt-auto space-y-5">
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                <Lock className="w-4 h-4 text-[#0056b3]" />
              </div>
              Restricted Access Level 4
            </div>
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              Encrypted Session
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Authentication Form */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-slate-50 relative">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex flex-col items-center mb-10 w-full">
          <img src="/assets/img/csdac-navbar.png" alt="CSDAC" className="h-14 w-14 object-contain mb-4" />
          <h1 className="text-2xl font-bold text-[#0f172a] text-center">CSDAC Admin Portal</h1>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-100 text-primary-900 text-xs font-bold uppercase tracking-widest mb-4">
              <Lock className="w-3 h-3" /> Admin Area
            </div>
            <h2 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Admin Sign In</h2>
            <p className="text-slate-500 text-[15px]">Enter your administrative credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider" htmlFor="email">
                Admin Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@csdac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-slate-300 rounded-md h-12 text-[15px] focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] transition-shadow shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm font-bold text-[#0f172a] hover:underline">
                  Reset credentials?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-slate-300 rounded-md h-12 text-[15px] focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] transition-shadow shadow-sm"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full h-12 rounded-md shadow-sm text-white text-[15px] font-bold mt-2 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed bg-primary-600 hover:bg-primary-700"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-[12px] uppercase tracking-wider font-semibold">
              Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 text-[#0f172a] font-bold">Loading Secure Portal...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
