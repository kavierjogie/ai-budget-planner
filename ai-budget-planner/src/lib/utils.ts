import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy');
}

export function getCurrentMonthYear(): string {
  return format(new Date(), 'yyyy-MM');
}

export function getMonthYearLabel(monthYear: string): string {
  const [year, month] = monthYear.split('-');
  return format(new Date(parseInt(year), parseInt(month) - 1, 1), 'MMMM yyyy');
}

export function getLast6Months(): string[] {
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    months.push(format(subMonths(new Date(), i), 'yyyy-MM'));
  }
  return months;
}

export function getBudgetStatusColor(status: string): string {
  switch (status) {
    case 'overspent': return 'text-red-400';
    case 'on_budget': return 'text-yellow-400';
    case 'under_budget': return 'text-emerald-400';
    default: return 'text-slate-400';
  }
}

export function getBudgetStatusLabel(status: string): string {
  switch (status) {
    case 'overspent': return 'Overspent';
    case 'on_budget': return 'On Budget';
    case 'under_budget': return 'Under Budget';
    default: return 'Unknown';
  }
}

export function calculateBudgetStatus(income: number, expenses: number): 'overspent' | 'on_budget' | 'under_budget' {
  const ratio = expenses / income;
  if (ratio > 1) return 'overspent';
  if (ratio >= 0.9) return 'on_budget';
  return 'under_budget';
}

export function getStartOfMonth(monthYear?: string): string {
  if (monthYear) {
    const [year, month] = monthYear.split('-');
    return format(startOfMonth(new Date(parseInt(year), parseInt(month) - 1, 1)), 'yyyy-MM-dd');
  }
  return format(startOfMonth(new Date()), 'yyyy-MM-dd');
}

export function getEndOfMonth(monthYear?: string): string {
  if (monthYear) {
    const [year, month] = monthYear.split('-');
    return format(endOfMonth(new Date(parseInt(year), parseInt(month) - 1, 1)), 'yyyy-MM-dd');
  }
  return format(endOfMonth(new Date()), 'yyyy-MM-dd');
}
