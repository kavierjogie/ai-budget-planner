import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#e3ecf2] text-[#2f4157]',
    success: 'bg-[#e3ecf2] text-[#567c8e] border border-[#a2c1d1]',
    warning: 'bg-[#c7d9e5] text-[#2f4157] border border-[#a2c1d1]',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/20',
    info: 'bg-[#e3ecf2] text-[#2f4157] border border-[#a2c1d1]',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-[#e3ecf2] p-4 text-[#567c8e]">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-semibold text-[#2f4157]">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-[#567c8e]">{description}</p>
      {action}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <svg className={cn('animate-spin text-[#567c8e]', sizes[size])} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color?: 'indigo' | 'emerald' | 'amber' | 'red';
}

export function StatCard({ label, value, subtext, icon, trend, color = 'indigo' }: StatCardProps) {
  const colors = {
    indigo: 'bg-[#e3ecf2] text-[#2f4157] ring-[#a2c1d1]',
    emerald: 'bg-[#e3ecf2] text-[#567c8e] ring-[#a2c1d1]',
    amber: 'bg-[#c7d9e5] text-[#2f4157] ring-[#a2c1d1]',
    red: 'bg-red-500/10 text-red-400 ring-red-500/20',
  };
  return (
    <div className="rounded-xl border border-[#c7d9e5] bg-white p-5 shadow-sm shadow-[#2f4157]/5">
      <div className="flex items-start justify-between">
        <div className={cn('rounded-lg p-2.5 ring-1', colors[color])}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium',
            trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'
          )}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-100">{value}</p>
        <p className="mt-0.5 text-sm text-slate-500">{label}</p>
        {subtext && <p className="mt-1 text-xs text-slate-600">{subtext}</p>}
      </div>
    </div>
  );
}
