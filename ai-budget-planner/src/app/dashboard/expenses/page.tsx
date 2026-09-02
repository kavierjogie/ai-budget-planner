'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, TrendingDown, RefreshCcw, Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate, getCurrentMonthYear, getMonthYearLabel } from '@/lib/utils';
import { Expense, EXPENSE_CATEGORIES } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { EmptyState, LoadingSpinner, Badge } from '@/components/ui';
import ExpenseForm from '@/components/dashboard/ExpenseForm';

export default function ExpensesPage() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const monthYear = getCurrentMonthYear();

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .order('date', { ascending: false });

    setExpenses(data || []);
    setLoading(false);
  }, [monthYear]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('expenses').delete().eq('id', deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchExpenses();
  };

  const filtered = filterCategory === 'all' ? expenses : expenses.filter(e => e.category === filterCategory);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Expenses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{getMonthYearLabel(monthYear)}</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          Add Expense
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5 ring-1 ring-amber-500/20">
              <TrendingDown size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total expenses</p>
              <p className="text-xl font-bold text-slate-100">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 mb-1">Entries</p>
          <p className="text-xl font-bold text-slate-100">{expenses.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 mb-1">Top category</p>
          <p className="text-sm font-semibold text-slate-200 truncate">
            {topCategory ? EXPENSE_CATEGORIES.find(c => c.value === topCategory[0])?.label : '—'}
          </p>
          {topCategory && <p className="text-xs text-slate-500">{formatCurrency(topCategory[1])}</p>}
        </Card>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-400 hover:text-slate-200'}`}
        >
          All
        </button>
        {EXPENSE_CATEGORIES.filter(c => byCategory[c.value]).map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilterCategory(cat.value)}
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterCategory === cat.value ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-400 hover:text-slate-200'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Expense list */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filterCategory === 'all' ? 'All Expenses' : EXPENSE_CATEGORIES.find(c => c.value === filterCategory)?.label}
          </CardTitle>
          <span className="text-xs text-slate-500">{filtered.length} entries</span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<TrendingDown size={28} />}
              title="No expenses recorded"
              description="Track your spending by adding expenses. Categorise them to see where your money goes."
              action={<Button size="sm" onClick={() => setShowAdd(true)}><Plus size={14} />Add Expense</Button>}
            />
          ) : (
            <div className="divide-y divide-slate-700/50">
              {filtered.map(item => {
                const catInfo = EXPENSE_CATEGORIES.find(c => c.value === item.category);
                return (
                  <div key={item.id} className="flex items-center justify-between py-3.5 group">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: `${catInfo?.color}25`, color: catInfo?.color }}
                      >
                        {item.description[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{item.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500">{formatDate(item.date)}</span>
                          <span className="text-xs rounded-full px-2 py-0.5" style={{ backgroundColor: `${catInfo?.color}20`, color: catInfo?.color }}>
                            {catInfo?.label}
                          </span>
                          {item.is_recurring && (
                            <Badge variant="info"><RefreshCcw size={9} className="mr-0.5" />recurring</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-red-400">{formatCurrency(item.amount)}</p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditItem(item)} className="rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="rounded-lg p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={showAdd || !!editItem} onClose={() => { setShowAdd(false); setEditItem(null); }} title={editItem ? 'Edit Expense' : 'Add Expense'}>
        <ExpenseForm
          editItem={editItem}
          onSuccess={() => { setShowAdd(false); setEditItem(null); fetchExpenses(); }}
          onCancel={() => { setShowAdd(false); setEditItem(null); }}
        />
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Expense" size="sm">
        <p className="text-sm text-slate-400 mb-5">Are you sure you want to delete this expense? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
