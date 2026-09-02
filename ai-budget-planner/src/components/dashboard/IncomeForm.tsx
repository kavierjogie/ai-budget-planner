'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentMonthYear } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Income } from '@/types';

interface IncomeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editItem?: Income | null;
}

export default function IncomeForm({ onSuccess, onCancel, editItem }: IncomeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    source: editItem?.source || '',
    amount: editItem?.amount?.toString() || '',
    description: editItem?.description || '',
    date: editItem?.date || new Date().toISOString().split('T')[0],
    is_recurring: editItem?.is_recurring || false,
    recurrence_interval: editItem?.recurrence_interval || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.source || !form.amount || !form.date) {
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

    const payload = {
      user_id: user.id,
      source: form.source,
      amount,
      description: form.description || null,
      date: form.date,
      is_recurring: form.is_recurring,
      recurrence_interval: form.is_recurring ? form.recurrence_interval || null : null,
    };

    const { error: dbError } = editItem
      ? await supabase.from('income').update(payload).eq('id', editItem.id)
      : await supabase.from('income').insert(payload);

    if (dbError) { setError(dbError.message); setLoading(false); return; }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Income Source *"
        placeholder="e.g. Salary, Freelance, Side hustle"
        value={form.source}
        onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
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
      <Input
        label="Date *"
        type="date"
        value={form.date}
        onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
        required
      />
      <Input
        label="Description (optional)"
        placeholder="Additional notes"
        value={form.description}
        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
      />
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="income-recurring"
          checked={form.is_recurring}
          onChange={e => setForm(p => ({ ...p, is_recurring: e.target.checked }))}
          className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="income-recurring" className="text-sm text-slate-300">Recurring income</label>
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
        <Button type="submit" loading={loading} className="flex-1">{editItem ? 'Save Changes' : 'Add Income'}</Button>
      </div>
    </form>
  );
}
