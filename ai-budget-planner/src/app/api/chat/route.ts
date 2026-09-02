import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatWithFinancialAdvisor } from '@/lib/groq';
import { getCurrentMonthYear } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await request.json();
    const monthYear = getCurrentMonthYear();
    const [year, month] = monthYear.split('-');
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${lastDay}`;

    // Fetch financial context
    const [incomeRes, expensesRes, goalsRes, profileRes] = await Promise.all([
      supabase.from('income').select('amount').eq('user_id', user.id).gte('date', startDate).lte('date', endDate),
      supabase.from('expenses').select('amount, category').eq('user_id', user.id).eq('month_year', monthYear),
      supabase.from('savings_goals').select('name, target_amount, current_amount').eq('user_id', user.id).eq('is_completed', false),
      supabase.from('profiles').select('currency').eq('user_id', user.id).single(),
    ]);

    const totalIncome = (incomeRes.data || []).reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = (expensesRes.data || []).reduce((sum, e) => sum + e.amount, 0);

    const spendingByCategory: Record<string, number> = {};
    (expensesRes.data || []).forEach(exp => {
      spendingByCategory[exp.category] = (spendingByCategory[exp.category] || 0) + exp.amount;
    });

    const reply = await chatWithFinancialAdvisor(messages, {
      totalIncome,
      totalExpenses,
      spendingByCategory,
      savingsGoals: goalsRes.data || [],
      currency: profileRes.data?.currency || 'ZAR',
      budgetStatus: totalExpenses > totalIncome ? 'overspent' : totalExpenses / totalIncome >= 0.9 ? 'on_budget' : 'under_budget',
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: error.message || 'Chat failed' }, { status: 500 });
  }
}
