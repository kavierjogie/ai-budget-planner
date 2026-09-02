'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SavingsGoal } from '@/types';

interface GoalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editItem?: SavingsGoal | null;
}

export default function GoalForm({ onSuccess, onCancel, editItem }: GoalFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: editItem?.name || '',
    description: editItem?.description || '',
    target_amount: editItem?.target_amount?.toString() || '',
    current_amount: editItem?.current_amount?.toString() || '0',
    target_date: editItem?.target_date?.split('T')[0] || '',
    duration_months: editItem?.duration_months?.toString() || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.target_amount) {
      setError('Please enter a goal name and target amount.');
      return;
    }
    const target = parseFloat(form.target_amount);
    const current = parseFloat(form.current_amount) || 0;
    if (isNaN(target) || target <= 0) { setError('Enter a valid target amount.'); return; }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated.'); setLoading(false); return; }

    const payload = {
      user_id: user.id,
      name: form.name,
      description: form.description || null,
      target_amount: target,
      current_amount: current,
      target_date: form.target_date || null,
      duration_months: form.duration_months ? parseInt(form.duration_months) : null,
      is_completed: current >= target,
    };

    const { error: dbError } = editItem
      ? await supabase.from('savings_goals').update(payload).eq('id', editItem.id)
      : await supabase.from('savings_goals').insert(payload);

    if (dbError) { setError(dbError.message); setLoading(false); return; }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Goal Name *"
        placeholder="e.g. Emergency Fund, Holiday, New Laptop"
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        required
      />
      <Input
        label="Description (optional)"
        placeholder="What are you saving for?"
        value={form.description}
        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Target Amount (R) *"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.target_amount}
          onChange={e => setForm(p => ({ ...p, target_amount: e.target.value }))}
          required
        />
        <Input
          label="Amount Saved So Far (R)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.current_amount}
          onChange={e => setForm(p => ({ ...p, current_amount: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Target Date (optional)"
          type="date"
          value={form.target_date}
          onChange={e => setForm(p => ({ ...p, target_date: e.target.value }))}
        />
        <Input
          label="Duration (months)"
          type="number"
          min="1"
          placeholder="e.g. 6"
          value={form.duration_months}
          onChange={e => setForm(p => ({ ...p, duration_months: e.target.value }))}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{editItem ? 'Save Changes' : 'Create Goal'}</Button>
      </div>
    </form>
  );
}
