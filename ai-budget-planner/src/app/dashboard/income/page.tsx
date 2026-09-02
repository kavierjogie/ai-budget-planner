'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, TrendingUp, RefreshCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate, getCurrentMonthYear, getMonthYearLabel } from '@/lib/utils';
import { Income } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { EmptyState, LoadingSpinner, Badge } from '@/components/ui';
import IncomeForm from '@/components/dashboard/IncomeForm';

export default function IncomePage() {
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState<Income[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Income | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const monthYear = getCurrentMonthYear();

  const fetchIncome = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [year, month] = monthYear.split('-');
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${lastDay}`;

    const { data } = await supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    setIncome(data || []);
    setLoading(false);
  }, [monthYear]);

  useEffect(() => { fetchIncome(); }, [fetchIncome]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('income').delete().eq('id', deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchIncome();
  };

  const totalIncome = income.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Income</h1>
          <p className="text-sm text-slate-500 mt-0.5">{getMonthYearLabel(monthYear)}</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          Add Income
        </Button>
      </div>

      {/* Summary */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-indigo-500/10 p-3 ring-1 ring-indigo-500/20">
            <TrendingUp size={22} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total income this month</p>
            <p className="text-3xl font-bold text-slate-100">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
      </Card>

      {/* Income list */}
      <Card>
        <CardHeader>
          <CardTitle>All Income Sources</CardTitle>
          <span className="text-xs text-slate-500">{income.length} entries</span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : income.length === 0 ? (
            <EmptyState
              icon={<TrendingUp size={28} />}
              title="No income recorded"
              description="Add your salary, freelance work, or any other income sources for this month."
              action={<Button size="sm" onClick={() => setShowAdd(true)}><Plus size={14} />Add Income</Button>}
            />
          ) : (
            <div className="divide-y divide-slate-700/50">
              {income.map(item => (
                <div key={item.id} className="flex items-center justify-between py-3.5 group">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold">
                      {item.source[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.source}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{formatDate(item.date)}</span>
                        {item.is_recurring && (
                          <Badge variant="info">
                            <RefreshCcw size={9} className="mr-0.5" />
                            {item.recurrence_interval}
                          </Badge>
                        )}
                      </div>
                      {item.description && <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-emerald-400">{formatCurrency(item.amount)}</p>
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={showAdd || !!editItem}
        onClose={() => { setShowAdd(false); setEditItem(null); }}
        title={editItem ? 'Edit Income' : 'Add Income'}
      >
        <IncomeForm
          editItem={editItem}
          onSuccess={() => { setShowAdd(false); setEditItem(null); fetchIncome(); }}
          onCancel={() => { setShowAdd(false); setEditItem(null); }}
        />
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Income" size="sm">
        <p className="text-sm text-slate-400 mb-5">Are you sure you want to delete this income entry? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
