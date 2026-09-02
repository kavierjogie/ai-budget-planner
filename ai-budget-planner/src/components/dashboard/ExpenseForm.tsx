'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentMonthYear } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Expense, EXPENSE_CATEGORIES, ExpenseCategory } from '@/types';

interface ExpenseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editItem?: Expense | null;
}

export default function ExpenseForm({ onSuccess, onCancel, editItem }: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    description: editItem?.description || '',
    amount: editItem?.amount?.toString() || '',
    category: editItem?.category || '' as ExpenseCategory | '',
    date: editItem?.date || new Date().toISOString().split('T')[0],
    is_recurring: editItem?.is_recurring || false,
    recurrence_interval: editItem?.recurrence_interval || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.description || !form.amount || !form.category || !form.date) {
      setError('Please fill in all required fields.');
      return;
    }
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated.'); setLoading(false); return; }

    // Determine month_year from selected date
    const dateParts = form.date.split('-');
    const monthYear = `${dateParts[0]}-${dateParts[1]}`;

    const payload = {
      user_id: user.id,
      description: form.description,
      amount,
      category: form.category as ExpenseCategory,
      date: form.date,
      is_recurring: form.is_recurring,
      recurrence_interval: form.is_recurring ? form.recurrence_interval || null : null,
      is_missed: false,
      month_year: monthYear,
    };

    const { error: dbError } = editItem
      ? await supabase.from('expenses').update(payload).eq('id', editItem.id)
      : await supabase.from('expenses').insert(payload);

    if (dbError) { setError(dbError.message); setLoading(false); return; }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Description *"
        placeholder="e.g. Netflix subscription, Grocery run"
        value={form.description}
        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
        required
      />
      <Input
        label="Amount (R) *"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        value={form.amount}
        onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
        required
      />
      <Select
        label="Category *"
        value={form.category}
        onChange={e => setForm(p => ({ ...p, category: e.target.value as ExpenseCategory }))}
        options={EXPENSE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
        placeholder="Select a category"
      />
      <Input
        label="Date *"
        type="date"
        value={form.date}
        onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
        required
      />
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="expense-recurring"
          checked={form.is_recurring}
          onChange={e => setForm(p => ({ ...p, is_recurring: e.target.checked }))}
          className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="expense-recurring" className="text-sm text-slate-300">Recurring expense</label>
      </div>
      {form.is_recurring && (
        <Select
          label="Recurrence"
          value={form.recurrence_interval}
          onChange={e => setForm(p => ({ ...p, recurrence_interval: e.target.value }))}
          options={[
            { value: 'weekly', label: 'Weekly' },
            { value: 'biweekly', label: 'Every two weeks' },
            { value: 'monthly', label: 'Monthly' },
          ]}
          placeholder="Select interval"
        />
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{editItem ? 'Save Changes' : 'Add Expense'}</Button>
      </div>
    </form>
  );
}
