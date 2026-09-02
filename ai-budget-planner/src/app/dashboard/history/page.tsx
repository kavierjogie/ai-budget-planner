'use client';

import { useState, useEffect, useCallback } from 'react';
import { History, Sparkles, TrendingUp, TrendingDown, PiggyBank, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, getMonthYearLabel, getBudgetStatusLabel } from '@/lib/utils';
import { FinancialAnalysis } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EmptyState, LoadingSpinner, Badge } from '@/components/ui';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<FinancialAnalysis[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('financial_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('month_year', { ascending: false });

    setAnalyses(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  if (loading) return <div className="flex h-screen items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Financial History</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your month-by-month financial record and AI analyses</p>
      </div>

      {analyses.length === 0 ? (
        <Card>
          <EmptyState
            icon={<History size={32} />}
            title="No history yet"
            description="Once you run an AI analysis on your finances, your monthly summaries will appear here. Go to Overview and click 'AI Analysis'."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {analyses.map(analysis => {
            const isExpanded = expanded === analysis.id;
            const statusVariant = analysis.budget_status === 'overspent' ? 'danger' : analysis.budget_status === 'on_budget' ? 'warning' : 'success';
            const savingsRate = analysis.total_income > 0
              ? ((analysis.amount_saved / analysis.total_income) * 100).toFixed(1)
              : '0.0';

            return (
              <Card key={analysis.id}>
                <button
                  className="w-full"
                  onClick={() => setExpanded(isExpanded ? null : analysis.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="font-semibold text-slate-200">{getMonthYearLabel(analysis.month_year)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={statusVariant}>{getBudgetStatusLabel(analysis.budget_status)}</Badge>
                          <span className="text-xs text-slate-500">Savings rate: {savingsRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Income</p>
                          <p className="font-semibold text-indigo-400">{formatCurrency(analysis.total_income)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Expenses</p>
                          <p className="font-semibold text-amber-400">{formatCurrency(analysis.total_expenses)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Saved</p>
                          <p className="font-semibold text-emerald-400">{formatCurrency(analysis.amount_saved)}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-700/50 space-y-5">
                    {/* Mobile summary */}
                    <div className="sm:hidden grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-slate-700/30 p-3 text-center">
                        <p className="text-xs text-slate-500">Income</p>
                        <p className="text-sm font-semibold text-indigo-400">{formatCurrency(analysis.total_income)}</p>
                      </div>
                      <div className="rounded-lg bg-slate-700/30 p-3 text-center">
                        <p className="text-xs text-slate-500">Expenses</p>
                        <p className="text-sm font-semibold text-amber-400">{formatCurrency(analysis.total_expenses)}</p>
                      </div>
                      <div className="rounded-lg bg-slate-700/30 p-3 text-center">
                        <p className="text-xs text-slate-500">Saved</p>
                        <p className="text-sm font-semibold text-emerald-400">{formatCurrency(analysis.amount_saved)}</p>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    {analysis.ai_analysis && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={14} className="text-indigo-400" />
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">AI Analysis</p>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{analysis.ai_analysis}</p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysis.ai_recommendations?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Recommendations</p>
                        <ul className="space-y-1.5">
                          {analysis.ai_recommendations.map((rec, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-400">
                              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold">{i + 1}</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Spending by category */}
                    {Object.keys(analysis.spending_by_category || {}).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Spending Breakdown</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(analysis.spending_by_category)
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .map(([cat, amount]) => (
                              <div key={cat} className="flex items-center justify-between rounded-lg bg-slate-700/30 px-3 py-2">
                                <span className="text-xs text-slate-400 capitalize">{cat.replace('_', ' ')}</span>
                                <span className="text-xs font-medium text-slate-200">{formatCurrency(amount as number)}</span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
