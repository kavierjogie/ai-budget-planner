'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Target, CheckCircle, Calendar, PlusCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SavingsGoal } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { EmptyState, LoadingSpinner, Badge } from '@/components/ui';
import GoalForm from '@/components/dashboard/GoalForm';

export default function GoalsPage() {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [completed, setCompleted] = useState<SavingsGoal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<SavingsGoal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [depositGoal, setDepositGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositing, setDepositing] = useState(false);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setGoals((data || []).filter((g: SavingsGoal) => !g.is_completed));
    setCompleted((data || []).filter((g: SavingsGoal) => g.is_completed));
    setLoading(false);
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('savings_goals').delete().eq('id', deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchGoals();
  };

  const handleDeposit = async () => {
    if (!depositGoal || !depositAmount) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;
    setDepositing(true);
    const supabase = createClient();
    const newAmount = depositGoal.current_amount + amount;
    const isCompleted = newAmount >= depositGoal.target_amount;
    await supabase
      .from('savings_goals')
      .update({ current_amount: newAmount, is_completed: isCompleted })
      .eq('id', depositGoal.id);
    setDepositGoal(null);
    setDepositAmount('');
    setDepositing(false);
    fetchGoals();
  };

  const GoalCard = ({ goal }: { goal: SavingsGoal }) => {
    const pct = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
    const remaining = goal.target_amount - goal.current_amount;
    const daysLeft = goal.target_date
      ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <Card className="group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
              <Target size={18} />
            </div>
            <div>
              <p className="font-semibold text-slate-200">{goal.name}</p>
              {goal.description && <p className="text-xs text-slate-500 mt-0.5">{goal.description}</p>}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setEditItem(goal)} className="rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={() => setDeleteId(goal.id)} className="rounded-lg p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-slate-200">{formatCurrency(goal.current_amount)}</span>
            <span className="text-slate-500">of {formatCurrency(goal.target_amount)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{pct.toFixed(0)}% complete</span>
            <span>{formatCurrency(remaining)} to go</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {goal.target_date && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {daysLeft !== null && daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
              </span>
            )}
            {goal.duration_months && (
              <span>{goal.duration_months} month goal</span>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={() => { setDepositGoal(goal); setDepositAmount(''); }}>
            <PlusCircle size={13} />
            Add savings
          </Button>
        </div>
      </Card>
    );
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Savings Goals</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your progress toward financial targets</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          New Goal
        </Button>
      </div>

      {goals.length === 0 && completed.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Target size={32} />}
            title="No savings goals yet"
            description="Set a savings goal to track your progress and stay motivated. Whether it's an emergency fund, holiday, or new gear — every goal starts here."
            action={<Button onClick={() => setShowAdd(true)}><Plus size={14} />Create your first goal</Button>}
          />
        </Card>
      ) : (
        <>
          {goals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Active Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completed.map(goal => (
                  <Card key={goal.id} className="opacity-70">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-300 truncate">{goal.name}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(goal.target_amount)} — completed</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={showAdd || !!editItem} onClose={() => { setShowAdd(false); setEditItem(null); }} title={editItem ? 'Edit Goal' : 'New Savings Goal'}>
        <GoalForm
          editItem={editItem}
          onSuccess={() => { setShowAdd(false); setEditItem(null); fetchGoals(); }}
          onCancel={() => { setShowAdd(false); setEditItem(null); }}
        />
      </Modal>

      <Modal open={!!depositGoal} onClose={() => setDepositGoal(null)} title="Add Savings" size="sm">
        {depositGoal && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Add money to <strong className="text-slate-200">{depositGoal.name}</strong></p>
            <p className="text-xs text-slate-500">Current: {formatCurrency(depositGoal.current_amount)} / {formatCurrency(depositGoal.target_amount)}</p>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount to add (R)"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDepositGoal(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleDeposit} loading={depositing} className="flex-1">Add Savings</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Goal" size="sm">
        <p className="text-sm text-slate-400 mb-5">Delete this savings goal? Your progress will be lost.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
