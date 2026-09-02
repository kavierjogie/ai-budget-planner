import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentMonthYear } from '@/lib/utils';
import { format, subMonths } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentMonthYear = getCurrentMonthYear();
    const lastMonthYear = format(subMonths(new Date(), 1), 'yyyy-MM');

    // Get recurring expenses from last month
    const { data: recurringExpenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', lastMonthYear)
      .eq('is_recurring', true);

    if (!recurringExpenses || recurringExpenses.length === 0) {
      return NextResponse.json({ message: 'No recurring expenses found', carried: 0 });
    }

    // Check which ones haven't been carried to current month
    const { data: currentExpenses } = await supabase
      .from('expenses')
      .select('description, category')
      .eq('user_id', user.id)
      .eq('month_year', currentMonthYear);

    const currentDescriptions = new Set(
      (currentExpenses || []).map(e => `${e.description}-${e.category}`)
    );

    const toCarry = recurringExpenses.filter(
      exp => !currentDescriptions.has(`${exp.description}-${exp.category}`)
    );

    let carried = 0;
    const notifications = [];

    for (const expense of toCarry) {
      const [year, month] = currentMonthYear.split('-');
      const newDate = `${year}-${month}-01`;

      // Carry expense to current month
      const { error } = await supabase.from('expenses').insert({
        user_id: user.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: newDate,
        is_recurring: true,
        recurrence_interval: expense.recurrence_interval,
        is_missed: false,
        month_year: currentMonthYear,
      });

      if (!error) {
        carried++;
        // Create notification
        notifications.push({
          user_id: user.id,
          type: 'missed_expense',
          title: 'Recurring expense added',
          message: `Your recurring expense "${expense.description}" has been carried forward to this month.`,
          is_read: false,
          related_expense_id: expense.id,
        });
      }
    }

    if (notifications.length > 0) {
      await supabase.from('notifications').insert(notifications);
    }

    return NextResponse.json({ message: `Carried ${carried} recurring expenses`, carried });
  } catch (error: any) {
    console.error('Recurring expenses error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
