'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import {
  LayoutDashboard, TrendingUp, TrendingDown, Target, History,
  Bell, LogOut, Menu, X, Bot, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
  { href: '/dashboard/expenses', label: 'Expenses', icon: TrendingDown },
  { href: '/dashboard/goals', label: 'Savings Goals', icon: Target },
  { href: '/dashboard/history', label: 'History', icon: History },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
];

interface SidebarProps {
  userName?: string;
  unreadCount?: number;
}

export default function Sidebar({ userName, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-700/50">
        <Logo subtitle="Smart Finance" size="sm" />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const isNotif = item.href === '/dashboard/notifications';
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-indigo-600/15 text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
              )}
            >
              <Icon size={17} className={active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="flex-1">{item.label}</span>
              {isNotif && unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {active && <ChevronRight size={14} className="text-indigo-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-700/50 p-3 space-y-1">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 text-sm font-bold">
            {userName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{userName || 'User'}</p>
            <p className="text-xs text-slate-500">Free plan</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 disabled:opacity-50"
        >
          <LogOut size={16} />
          <span>{signingOut ? 'Signing out...' : 'Sign out'}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-56 lg:w-64 flex-col h-screen sticky top-0 border-r border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-900/90 backdrop-blur-sm">
        <Link href="/dashboard">
          <Logo size="sm" />
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-400 hover:text-slate-100 p-1">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col bg-slate-900 border-r border-slate-700/50 shadow-2xl">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
