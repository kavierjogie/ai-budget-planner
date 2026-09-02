import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/20',
    info: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20',
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
      <div className="mb-4 rounded-full bg-slate-700/50 p-4 text-slate-500">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-semibold text-slate-300">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>
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
      <svg className={cn('animate-spin text-indigo-500', sizes[size])} fill="none" viewBox="0 0 24 24">
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
    indigo: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    red: 'bg-red-500/10 text-red-400 ring-red-500/20',
  };
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">
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
