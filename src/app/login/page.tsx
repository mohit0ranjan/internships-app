'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, ShieldCheck, CheckCircle2, FileCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/student';
  
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
        setError('Invalid email or password');
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
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      
      {/* Left Panel: Branding & Trust (Light Theme) */}
      <div className="hidden md:flex w-full md:w-5/12 lg:w-1/2 bg-blue-50 p-10 lg:p-16 flex-col relative overflow-hidden border-r border-blue-100">
        {/* Subtle Map Background */}
        <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
          <img src="/assets/img/indiamap.svg" alt="" className="w-full h-full object-contain scale-150" />
        </div>

        {/* Decorative Flag Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent-500 via-primary-500 to-green-600"></div>

        <div className="relative z-10 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-primary-900 transition-colors text-sm font-semibold mb-16 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Portal
          </Link>

          <div className="flex items-center gap-4 mb-10">
            <img src="/assets/img/csdac-navbar.png" alt="CSDAC" className="h-16 w-16 object-contain" />
            <div className="h-10 w-px bg-slate-300"></div>
            <span className="text-xl font-bold text-navy-900 tracking-wide">CSDAC</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-navy-900 leading-[1.15] tracking-tight mb-6">
            Secure Access to your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-green-600">Internship Workspace</span>
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed max-w-md mb-12">
            Log in to manage your tasks, submit research milestones, and communicate directly with your assigned scientists and mentors.
          </p>

          {/* Trust Badges */}
          <div className="mt-auto space-y-5">
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </div>
              Government Standard Security
            </div>
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-accent-600" />
              </div>
              Verified CSDAC Mentors
            </div>
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                <FileCheck className="w-4 h-4 text-primary-600" />
              </div>
              National Level Certification
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Authentication Form */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-background relative">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex flex-col items-center mb-10 w-full">
          <img src="/assets/img/csdac-navbar.png" alt="CSDAC" className="h-14 w-14 object-contain mb-4" />
          <h1 className="text-2xl font-bold text-navy-900 text-center">CSDAC Internship Portal</h1>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Sign In</h2>
            <p className="text-muted-foreground text-sm">Enter your registered email and password to access the workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-primary-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 mt-2 bg-accent-600 hover:bg-accent-700 text-white font-bold"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t text-center">
            <p className="text-muted-foreground text-sm">
              Don&apos;t have an account?{' '}
              <a href="/apply" className="font-bold text-primary-600 hover:underline">
                Apply for Internship
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-foreground font-bold">Loading Workspace...</div>}>
      <LoginForm />
    </Suspense>
  );
}
