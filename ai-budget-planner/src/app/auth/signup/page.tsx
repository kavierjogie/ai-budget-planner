'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wallet, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) { setError(error.message); setLoading(false); return; }

    // Create profile
    if (data.user) {
      await supabase.from('profiles').upsert({
        user_id: data.user.id,
        full_name: form.fullName,
        currency: 'ZAR',
      });
    }

    // If email confirmation is disabled, redirect directly
    if (data.session) {
      router.push('/dashboard');
      router.refresh();
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Check your email</h2>
          <p className="text-slate-400 text-sm">We've sent a confirmation link to <strong className="text-slate-200">{form.email}</strong>. Click it to activate your account.</p>
          <Link href="/auth/login" className="mt-6 inline-block text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-2xl shadow-indigo-500/40">
            <Wallet size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Start managing your money smarter</p>
        </div>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-8 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your name"
              value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              required
              autoComplete="name"
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              autoComplete="email"
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="At least 6 characters"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-3 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-slate-500/50 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
