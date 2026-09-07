export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Income {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  description: string | null;
  date: string;
  is_recurring: boolean;
  recurrence_interval: 'weekly' | 'biweekly' | 'monthly' | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  is_recurring: boolean;
  recurrence_interval: 'weekly' | 'biweekly' | 'monthly' | null;
  is_missed: boolean;
  month_year: string; // Format: YYYY-MM
  created_at: string;
  updated_at: string;
}

export type ExpenseCategory =
  | 'housing'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'healthcare'
  | 'education'
  | 'clothing'
  | 'utilities'
  | 'savings'
  | 'subscriptions'
  | 'personal_care'
  | 'other';

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; color: string }[] = [
  { value: 'housing', label: 'Housing', color: '#2f4157' },
  { value: 'food', label: 'Food & Dining', color: '#567c8e' },
  { value: 'transport', label: 'Transport', color: '#a2c1d1' },
  { value: 'entertainment', label: 'Entertainment', color: '#c7d9e5' },
  { value: 'healthcare', label: 'Healthcare', color: '#2f4157' },
  { value: 'education', label: 'Education', color: '#567c8e' },
  { value: 'clothing', label: 'Clothing', color: '#a2c1d1' },
  { value: 'utilities', label: 'Utilities', color: '#c7d9e5' },
  { value: 'savings', label: 'Savings', color: '#567c8e' },
  { value: 'subscriptions', label: 'Subscriptions', color: '#a2c1d1' },
  { value: 'personal_care', label: 'Personal Care', color: '#c7d9e5' },
  { value: 'other', label: 'Other', color: '#567c8e' },
];

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  duration_months: number | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialAnalysis {
  id: string;
  user_id: string;
  month_year: string;
  total_income: number;
  total_expenses: number;
  amount_saved: number;
  budget_status: 'overspent' | 'on_budget' | 'under_budget';
  ai_analysis: string;
  ai_recommendations: string[];
  spending_by_category: Record<string, number>;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'missed_expense' | 'goal_progress' | 'budget_alert' | 'tip';
  title: string;
  message: string;
  is_read: boolean;
  related_expense_id: string | null;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  amountAvailable: number;
  amountSaved: number;
  spendingByCategory: Record<string, number>;
  monthlyTrend: MonthlyTrend[];
  budgetStatus: 'overspent' | 'on_budget' | 'under_budget';
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  saved: number;
}
