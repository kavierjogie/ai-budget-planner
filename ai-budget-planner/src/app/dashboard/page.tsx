'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Sparkles, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, getCurrentMonthYear, getMonthYearLabel, getLast6Months, calculateBudgetStatus, getBudgetStatusColor, getBudgetStatusLabel } from '@/lib/utils';
import { generatePDFReport } from '@/lib/pdf';
import { EXPENSE_CATEGORIES, type MonthlyTrend } from '@/types';
import { StatCard, Badge, LoadingSpinner, EmptyState } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SpendingChart from '@/components/charts/SpendingChart';
import TrendChart from '@/components/charts/TrendChart';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    spendingByCategory: {} as Record<string, number>,
    monthlyTrend: [] as MonthlyTrend[],
    savingsGoals: [] as any[],
    analysis: null as any,
    userName: '',
  });
  const [error, setError] = useState('');

  const monthYear = getCurrentMonthYear();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [year, month] = monthYear.split('-');
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${lastDay}`;

    const [incomeRes, expensesRes, goalsRes, analysisRes, profileRes] = await Promise.all([
      supabase.from('income').select('*').eq('user_id', user.id).gte('date', startDate).lte('date', endDate),
      supabase.from('expenses').select('*').eq('user_id', user.id).eq('month_year', monthYear),
      supabase.from('savings_goals').select('*').eq('user_id', user.id).eq('is_completed', false).order('created_at', { ascending: false }),
      supabase.from('financial_analyses').select('*').eq('user_id', user.id).eq('month_year', monthYear).single(),
      supabase.from('profiles').select('full_name').eq('user_id', user.id).single(),
    ]);

    const totalIncome = (incomeRes.data || []).reduce((s: number, i: any) => s + i.amount, 0);
    const totalExpenses = (expensesRes.data || []).reduce((s: number, e: any) => s + e.amount, 0);

    const spendingByCategory: Record<string, number> = {};
    (expensesRes.data || []).forEach((exp: any) => {
      spendingByCategory[exp.category] = (spendingByCategory[exp.category] || 0) + exp.amount;
    });

    // Build monthly trend from last 6 months of analyses
    const last6 = getLast6Months();
    const { data: histData } = await supabase
      .from('financial_analyses')
      .select('month_year, total_income, total_expenses')
      .eq('user_id', user.id)
      .in('month_year', last6)
      .order('month_year');

    // Merge with current month data
    const trendMap = new Map((histData || []).map((h: any) => [h.month_year, h]));
    trendMap.set(monthYear, { month_year: monthYear, total_income: totalIncome, total_expenses: totalExpenses });

    const monthlyTrend = last6.map(m => {
      const d = trendMap.get(m);
      return { month: m, income: d?.total_income || 0, expenses: d?.total_expenses || 0, saved: Math.max(0, (d?.total_income || 0) - (d?.total_expenses || 0)) };
    });

    setData({
      totalIncome,
      totalExpenses,
      spendingByCategory,
      monthlyTrend,
      savingsGoals: goalsRes.data || [],
      analysis: analysisRes.data,
      userName: profileRes.data?.full_name || user.email?.split('@')[0] || 'User',
    });
    setLoading(false);
  }, [monthYear]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthYear }),
      });
      const result = await res.json();
      if (result.analysis) {
        setData(prev => ({ ...prev, analysis: result.savedAnalysis }));
        await fetchData();
      }
    } catch (err) {
      setError('Analysis failed. Check your Groq API key.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
    setGeneratingPDF(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [year, month] = monthYear.split('-');
      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const endDate = `${year}-${month}-${lastDay}`;

      const [incomeRes, expensesRes] = await Promise.all([
        supabase.from('income').select('source, amount, date').eq('user_id', user.id).gte('date', startDate).lte('date', endDate),
        supabase.from('expenses').select('description, category, amount, date').eq('user_id', user.id).eq('month_year', monthYear),
      ]);

      await generatePDFReport({
        userName: data.userName,
        monthYear,
        totalIncome: data.totalIncome,
        totalExpenses: data.totalExpenses,
        amountSaved: Math.max(0, data.totalIncome - data.totalExpenses),
        budgetStatus: data.analysis?.budget_status || calculateBudgetStatus(data.totalIncome, data.totalExpenses),
        spendingByCategory: data.spendingByCategory,
        incomeItems: (incomeRes.data || []).map((i: any) => ({ source: i.source, amount: i.amount, date: i.date })),
        expenseItems: (expensesRes.data || []).map((e: any) => ({ description: e.description, category: e.category, amount: e.amount, date: e.date })),
        savingsGoals: data.savingsGoals,
        aiRecommendations: data.analysis?.ai_recommendations || [],
        currency: 'ZAR',
      });
    } catch (err) {
      setError('PDF generation failed.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const amountAvailable = data.totalIncome - data.totalExpenses;
  const budgetStatus = data.analysis?.budget_status || (data.totalIncome > 0 ? calculateBudgetStatus(data.totalIncome, data.totalExpenses) : null);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Hey, {data.userName.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{getMonthYearLabel(monthYear)} overview</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {budgetStatus && (
            <Badge variant={budgetStatus === 'overspent' ? 'danger' : budgetStatus === 'on_budget' ? 'warning' : 'success'}>
              {getBudgetStatusLabel(budgetStatus)}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={runAnalysis} loading={analyzing}>
            <Sparkles size={14} />
            {analyzing ? 'Analysing...' : 'AI Analysis'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadPDF} loading={generatingPDF}>
            <Download size={14} />
            PDF Report
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Income" value={formatCurrency(data.totalIncome)} icon={<TrendingUp size={18} />} color="indigo" />
        <StatCard label="Total Expenses" value={formatCurrency(data.totalExpenses)} icon={<TrendingDown size={18} />} color={data.totalExpenses > data.totalIncome ? 'red' : 'amber'} />
        <StatCard label="Available" value={formatCurrency(Math.max(0, amountAvailable))} icon={<Wallet size={18} />} color={amountAvailable >= 0 ? 'emerald' : 'red'} />
        <StatCard label="Saved This Month" value={formatCurrency(Math.max(0, amountAvailable))} icon={<PiggyBank size={18} />} color="emerald" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingChart data={data.spendingByCategory} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6-Month Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={data.monthlyTrend} />
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis & Savings Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <Button variant="ghost" size="sm" onClick={runAnalysis} loading={analyzing}>
              <RefreshCw size={13} />
            </Button>
          </CardHeader>
          <CardContent>
            {data.analysis ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">{data.analysis.ai_analysis}</p>
                {data.analysis.ai_recommendations?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Recommendations</p>
                    <ul className="space-y-2">
                      {data.analysis.ai_recommendations.slice(0, 3).map((rec: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-400">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold">
                            {i + 1}
                          </span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <Sparkles size={32} className="text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 mb-4">Run an AI analysis to get personalised insights about your spending habits.</p>
                <Button size="sm" onClick={runAnalysis} loading={analyzing}>
                  <Sparkles size={14} />
                  Analyse My Finances
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Savings Goals</CardTitle>
            <a href="/dashboard/goals" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</a>
          </CardHeader>
          <CardContent>
            {data.savingsGoals.length > 0 ? (
              <div className="space-y-4">
                {data.savingsGoals.slice(0, 3).map(goal => {
                  const pct = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
                  return (
                    <div key={goal.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-200">{goal.name}</p>
                        <p className="text-xs text-slate-500">{pct.toFixed(0)}%</p>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-700">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{formatCurrency(goal.current_amount)}</span>
                        <span>{formatCurrency(goal.target_amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <PiggyBank size={32} className="text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 mb-4">No savings goals yet. Create one to start tracking your progress.</p>
                <a href="/dashboard/goals">
                  <Button size="sm" variant="outline">Create a goal</Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
