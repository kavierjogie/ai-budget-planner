'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/ui/Logo';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  Sparkles,
  Download,
  CheckCircle,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

// Custom SVG Icons for exact visual precision & compatibility
const ArrowRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const ShieldCheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const PieChartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
  </svg>
);

const FileTextIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const LockIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const BarChartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const ZapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const ArrowUpRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
);

const ArrowDownRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
  </svg>
);

const BuildingIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5v3m-6 0h6" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'income' | 'expenses' | 'goals'>('income');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      {/* Slow subtle ambient background lighting movement */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-br from-indigo-900/20 via-purple-900/15 to-transparent blur-[140px] animate-ambient-glow" />
        <div className="absolute top-[40%] -right-[200px] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[130px] animate-slow-pulse" />
        <div className="absolute top-[75%] -left-[200px] w-[700px] h-[700px] rounded-full bg-purple-950/15 blur-[150px] animate-ambient-glow" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} 
      />

      {/* Header / Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group cursor-pointer">
            <Logo showBadge size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#showcase" className="hover:text-slate-100 transition-colors">Dashboard</a>
            <a href="#goals" className="hover:text-slate-100 transition-colors">Savings Goals</a>
            <a href="#insights" className="hover:text-slate-100 transition-colors">Spending Insights</a>
            <a href="#reports" className="hover:text-slate-100 transition-colors">PDF Reports</a>
            <a href="#trust" className="hover:text-slate-100 transition-colors">Security</a>
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors hover:bg-slate-900/60"
            >
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="group relative text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 overflow-hidden"
            >
              <span>Get Started</span>
              <ArrowRightIcon className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900/50 border border-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3 text-base font-medium text-slate-300">
              <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Dashboard</a>
              <a href="#goals" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Savings Goals</a>
              <a href="#insights" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Spending Insights</a>
              <a href="#reports" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">PDF Reports</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Security</a>
            </nav>
            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="w-full text-center text-sm font-semibold text-slate-200 py-3 rounded-xl border border-slate-700 bg-slate-900/80"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="w-full text-center text-sm font-semibold text-white py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* 1. Full-screen Hero */}
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Editorial Content */}
              <div className="lg:col-span-6 space-y-8 text-left">
                {/* Subtle Luxury Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-purple-500/20 text-xs font-semibold uppercase tracking-wider text-purple-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Institutional Cashflow & Wealth Intelligence</span>
                </div>

                {/* Editorial Headline */}
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-sans">
                  Take control of your money with{' '}
                  <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-300 bg-clip-text text-transparent">
                    confidence.
                  </span>
                </h1>

                {/* Short Description */}
                <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-xl">
                  Streamline income tracking, intelligently categorize daily expenses, define target savings goals, and monitor real-time financial progress in one unified, luxury platform.
                </p>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/auth/signup"
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 hover:shadow-2xl hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <span>Get Started</span>
                    <ArrowRightIcon className="w-5 h-5 text-indigo-100 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/auth/login"
                    className="px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 font-semibold text-base border border-slate-700/80 hover:border-slate-500/80 transition-all duration-200 flex items-center justify-center gap-2 hover:text-white"
                  >
                    <span>Log In</span>
                  </Link>
                </div>

                {/* Micro Trust Indicators */}
                <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Zero setup fees</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheckIcon className="w-4 h-4 text-indigo-400" />
                    <span>Bank-grade privacy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ZapIcon className="w-4 h-4 text-purple-400" />
                    <span>Instant insights</span>
                  </div>
                </div>
              </div>

              {/* Right Realistic Premium Financial Dashboard Mockup */}
              <div className="lg:col-span-6 relative">
                {/* Glow Backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 rounded-3xl blur-2xl opacity-60 animate-slow-pulse" />
                
                {/* Mockup Container */}
                <div className="relative rounded-2xl glass-panel-luxury p-5 md:p-6 border border-slate-700/60 shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  
                  {/* macOS Control Bar */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-700/80" />
                      <div className="w-3 h-3 rounded-full bg-slate-700/80" />
                      <div className="w-3 h-3 rounded-full bg-slate-700/80" />
                    </div>
                    <div className="text-[11px] font-mono tracking-wider text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                      app.budgetai.com / Overview
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-slate-400 font-medium">Live</span>
                    </div>
                  </div>

                  {/* Top Net Worth Stat Header */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Net Position</span>
                      <div className="text-2xl font-bold text-white mt-1 font-sans">$128,450.00</div>
                      <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
                        <ArrowUpRightIcon className="w-3.5 h-3.5" />
                        <span>+$12,340.00 (+10.6%)</span>
                        <span className="text-slate-500 font-normal">this month</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monthly Surplus</span>
                      <div className="text-2xl font-bold text-indigo-300 mt-1 font-sans">$4,850.00</div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[72%] rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Cashflow SVG Visual Chart Mockup */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BarChartIcon className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-semibold text-slate-200">Cash Flow Projection</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800">Q3 2026</span>
                      </div>
                    </div>
                    {/* SVG Line Chart */}
                    <div className="h-28 w-full">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0,80 Q 80,40 160,55 T 320,20 T 400,10 L 400,100 L 0,100 Z"
                          fill="url(#chartGlow)"
                        />
                        <path
                          d="M 0,80 Q 80,40 160,55 T 320,20 T 400,10"
                          fill="none"
                          stroke="url(#lineGrad)"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="50%" stopColor="#c084fc" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </svg>
                    </div>
                  </div>

                  {/* Recent Activity List preview */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Recent Transactions</div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <ArrowDownRightIcon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">Stripe Capital Payout</div>
                          <div className="text-slate-500">Income • Direct Deposit</div>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-emerald-400">+$6,500.00</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <ArrowUpRightIcon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">Vanguard ETF Index</div>
                          <div className="text-slate-500">Savings • Investment</div>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-slate-300">-$1,500.00</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. Trust Section */}
        <section id="trust" className="py-16 border-y border-slate-800/60 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">Institutional Foundation</span>
              <h2 className="text-xl font-semibold text-slate-200 mt-1">Built on precision, privacy, and absolute control.</h2>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-slate-800/80">
              <div className="p-4 space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">$45M+</div>
                <div className="text-xs text-slate-400 font-medium">Tracked Personal Capital</div>
              </div>
              <div className="p-4 space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">99.9%</div>
                <div className="text-xs text-slate-400 font-medium">System Uptime Guarantee</div>
              </div>
              <div className="p-4 space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">256-Bit</div>
                <div className="text-xs text-slate-400 font-medium">AES End-to-End Encryption</div>
              </div>
              <div className="p-4 space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">4.95 / 5</div>
                <div className="text-xs text-slate-400 font-medium">User Satisfaction Rating</div>
              </div>
            </div>

            {/* Security Highlight Pill */}
            <div className="mt-12 max-w-xl mx-auto glass-panel rounded-2xl p-4 flex items-center justify-center gap-3 border border-slate-800 text-xs text-slate-300 text-center">
              <LockIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Your financial data is private, encrypted, and never sold to third-party ad networks.</span>
            </div>
          </div>
        </section>

        {/* 3. Dashboard Showcase */}
        <section id="showcase" className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Section Header */}
            <div className="max-w-3xl mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-indigo-400">
                <BarChartIcon className="w-4 h-4" />
                <span>Unified Command Center</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
                Complete financial clarity in a single glance.
              </h2>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                Consolidate income streams, monitor recurring fixed costs, and gain complete visibility into your monthly surplus before committing funds.
              </p>
            </div>

            {/* Feature Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Feature Selection Tabs */}
              <div className="lg:col-span-5 space-y-4">
                <button
                  onClick={() => setActiveTab('income')}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 ${
                    activeTab === 'income'
                      ? 'bg-slate-900/90 border-indigo-500/50 shadow-xl shadow-indigo-950/40'
                      : 'glass-panel border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2.5 rounded-xl ${activeTab === 'income' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Multi-Stream Income Tracking</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pl-12">
                    Log salaries, freelance payouts, dividends, and rental returns with automated frequency tagging.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 ${
                    activeTab === 'expenses'
                      ? 'bg-slate-900/90 border-purple-500/50 shadow-xl shadow-purple-950/40'
                      : 'glass-panel border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2.5 rounded-xl ${activeTab === 'expenses' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <PieChartIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Granular Expense Auditing</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pl-12">
                    Categorize everyday transactions seamlessly, detect wasteful recurring costs, and stay under budget limits.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('goals')}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 ${
                    activeTab === 'goals'
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-xl shadow-emerald-950/40'
                      : 'glass-panel border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2.5 rounded-xl ${activeTab === 'goals' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Automated Goal Accumulation</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pl-12">
                    Establish target savings funds with real-time percentage completion indicators and projected reach dates.
                  </p>
                </button>
              </div>

              {/* Editorial Photography & UI Overlay Showcase */}
              <div className="lg:col-span-7 relative">
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                  
                  {/* High Quality Editorial Lifestyle Image */}
                  <div className="relative h-[480px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200"
                      alt="Professional analyzing dashboard on laptop"
                      fill
                      className="object-cover brightness-[0.65] contrast-[1.1] group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  </div>

                  {/* Dynamic Floating Glass Card Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 glass-panel-luxury p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                          {activeTab === 'income' && 'Income Stream Overview'}
                          {activeTab === 'expenses' && 'Monthly Expense Allocation'}
                          {activeTab === 'goals' && 'Target Wealth Milestones'}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                        Updated 2m ago
                      </span>
                    </div>

                    {activeTab === 'income' && (
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                          <div className="text-[11px] text-slate-400">Primary Salary</div>
                          <div className="text-base font-bold text-white mt-1">$9,500.00</div>
                        </div>
                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                          <div className="text-[11px] text-slate-400">Consulting</div>
                          <div className="text-base font-bold text-emerald-400 mt-1">+$2,400.00</div>
                        </div>
                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                          <div className="text-[11px] text-slate-400">Dividends</div>
                          <div className="text-base font-bold text-indigo-300 mt-1">+$850.00</div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'expenses' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>Fixed Housing & Utilities</span>
                          <span className="font-mono font-semibold">$3,200 / $3,500</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full w-[91%]" />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Status: Within safe operational margin</span>
                          <span>91% Used</span>
                        </div>
                      </div>
                    )}

                    {activeTab === 'goals' && (
                      <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                        <div>
                          <div className="font-semibold text-white">Emergency Capital Fund</div>
                          <div className="text-slate-400 text-[11px]">Target: $30,000.00 • Completion: Q4 2026</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-400 text-sm">$27,400</div>
                          <div className="text-[10px] text-slate-400">91.3% Complete</div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Savings Goals Preview */}
        <section id="goals" className="py-24 md:py-32 bg-slate-900/20 border-t border-slate-800/60">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Lifestyle Photo */}
              <div className="lg:col-span-5 relative order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                  <div className="relative h-[520px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200"
                      alt="Financial planning moment with notebook and modern desk setup"
                      fill
                      className="object-cover brightness-[0.7] contrast-[1.05]"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>

                  {/* Badge Overlay */}
                  <div className="absolute top-6 left-6 glass-panel px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 border border-white/10">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>Goal Optimization Engine</span>
                  </div>
                </div>
              </div>

              {/* Right Content & Cards */}
              <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Wealth Acceleration</span>
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
                    Turn abstract targets into inevitable reality.
                  </h2>
                  <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                    Set dedicated savings buckets with custom milestones, target contribution schedules, and automated progress visualization.
                  </p>
                </div>

                {/* Goals Card Grid */}
                <div className="space-y-4">
                  
                  {/* Goal Card 1 */}
                  <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-white">Emergency Wealth Reserve</h4>
                          <p className="text-xs text-slate-400">6 Months Living Expenses</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        100% Achieved
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                      <div className="bg-emerald-400 h-full w-full" />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>Saved: $30,000.00</span>
                      <span>Target: $30,000.00</span>
                    </div>
                  </div>

                  {/* Goal Card 2 */}
                  <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <BuildingIcon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-white">Real Estate Equity Deposit</h4>
                          <p className="text-xs text-slate-400">Primary Residence Target</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        84.5% Progress
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[84.5%]" />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>Saved: $84,500.00</span>
                      <span>Target: $100,000.00</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. Spending Insights Preview */}
        <section id="insights" className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400">Intelligence Layer</span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
                Identify spending patterns before they impact net worth.
              </h2>
              <p className="text-slate-400 text-base sm:text-lg">
                Discover subtle cash leaks, optimize recurring payments, and increase your monthly savings rate without sacrificing lifestyle quality.
              </p>
            </div>

            {/* Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 space-y-6 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <PieChartIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Visual Breakdown</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Understand your exact category weights—from essential living overhead to discretionary lifestyle choices—with automatic grouping.
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-xs font-semibold text-indigo-300 flex items-center gap-1">
                  <span>Category optimization</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 space-y-6 group">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <ZapIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Leakage Detection</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Flag unused subscriptions, creeping recurring charges, and duplicate merchant fees automatically before each statement closes.
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-xs font-semibold text-purple-300 flex items-center gap-1">
                  <span>Recurring audit</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 space-y-6 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Surplus Expansion</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Users expand their monthly savings surplus by an average of 24% within the first 60 days of unified budget tracking.
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-xs font-semibold text-emerald-300 flex items-center gap-1">
                  <span>Surplus growth</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. PDF Reports Preview */}
        <section id="reports" className="py-24 md:py-32 bg-slate-900/30 border-t border-slate-800/60">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Copy */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">Executive Documentation</span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
                  Tax-ready PDF reports in a single click.
                </h2>
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                  Export refined, presentation-grade executive statements for personal record-keeping, tax preparation, or consultation with your financial advisor.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <CheckIcon className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span>Itemized monthly income & expense ledgers</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <CheckIcon className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span>Net worth movement & savings rate summaries</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <CheckIcon className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span>Instant client-side PDF generation—no waiting</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Explore sample statements</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Document Mockup Card */}
              <div className="lg:col-span-7">
                <div className="relative rounded-3xl glass-panel-luxury p-8 border border-slate-700/60 shadow-2xl">
                  
                  {/* Document Header Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <FileTextIcon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">EXECUTIVE FINANCIAL STATEMENT</h4>
                        <p className="text-xs text-slate-500 font-mono">ID: STMT-2026-08-AF</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                      CONFIDENTIAL
                    </span>
                  </div>

                  {/* Document Content Simulation */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500">Gross Inflow</span>
                        <div className="text-sm font-bold font-mono text-white mt-0.5">$18,450.00</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Total Outflow</span>
                        <div className="text-sm font-bold font-mono text-slate-300 mt-0.5">$7,620.00</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Net Surplus</span>
                        <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">+$10,830.00</div>
                      </div>
                    </div>

                    {/* Table Lines */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-2 border-b border-slate-800/60 text-slate-400 font-mono">
                        <span>Category</span>
                        <span>Amount</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-slate-300">
                        <span>Primary Income (Consulting)</span>
                        <span className="font-mono text-white">$14,000.00</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-slate-300">
                        <span>Investment Dividends</span>
                        <span className="font-mono text-white">$4,450.00</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-slate-300">
                        <span>Housing & Fixed Costs</span>
                        <span className="font-mono text-slate-400">-$4,200.00</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-slate-300">
                        <span>Discretionary Lifestyle</span>
                        <span className="font-mono text-slate-400">-$3,420.00</span>
                      </div>
                    </div>

                    {/* Download Button Simulator */}
                    <div className="pt-2 flex justify-end">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF Export</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 7. Final CTA */}
        <section className="py-24 md:py-36 relative overflow-hidden">
          {/* Subtle Glow Aura */}
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
            <div className="w-[800px] h-[400px] rounded-full bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-transparent blur-[140px]" />
          </div>

          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <div className="glass-panel-luxury p-10 sm:p-16 rounded-3xl border border-slate-700/80 shadow-2xl space-y-8">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 uppercase tracking-widest">
                <span>Start Your Financial Transformation</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto font-sans leading-tight">
                Take full ownership of your financial destiny.
              </h2>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Join forward-thinking individuals building long-term wealth with BudgetAI. Instant setup, zero friction.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>

                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-9 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Log In to Account</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-500 font-medium">
                No credit card required • 256-bit encryption • Instant access
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-xs text-slate-400">© 2026 BudgetAI Technologies Inc.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/auth/login" className="hover:text-slate-200 transition-colors">Log In</Link>
            <Link href="/auth/signup" className="hover:text-slate-200 transition-colors">Sign Up</Link>
            <a href="#showcase" className="hover:text-slate-200 transition-colors">Dashboard</a>
            <a href="#trust" className="hover:text-slate-200 transition-colors">Security</a>
          </div>

        </div>
      </footer>
    </div>
  );
}
