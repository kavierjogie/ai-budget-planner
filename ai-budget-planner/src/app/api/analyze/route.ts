import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeFinances } from '@/lib/groq';
import { getCurrentMonthYear, getLast6Months } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const monthYear = body.monthYear || getCurrentMonthYear();
    const [year, month] = monthYear.split('-');
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${lastDay}`;

    // Fetch income for the month
    const { data: incomeData } = await supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate);

    // Fetch expenses for the month
    const { data: expensesData } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', monthYear);

    // Fetch savings goals
    const { data: savingsGoals } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_completed', false);

    // Fetch last 6 months of analyses for trend
    const last6Months = getLast6Months();
    const { data: historicalData } = await supabase
      .from('financial_analyses')
      .select('month_year, total_income, total_expenses')
      .eq('user_id', user.id)
      .in('month_year', last6Months);

    const totalIncome = (incomeData || []).reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = (expensesData || []).reduce((sum, e) => sum + e.amount, 0);

    // Calculate spending by category
    const spendingByCategory: Record<string, number> = {};
    (expensesData || []).forEach(expense => {
      spendingByCategory[expense.category] = (spendingByCategory[expense.category] || 0) + expense.amount;
    });

    // Build monthly trend
    const monthlyTrend = (historicalData || []).map(h => ({
      month: h.month_year,
      income: h.total_income,
      expenses: h.total_expenses,
    }));

    // Get user profile for currency
    const { data: profile } = await supabase
      .from('profiles')
      .select('currency')
      .eq('user_id', user.id)
      .single();

    const currency = profile?.currency || 'ZAR';

    // Call Groq AI
    const aiResult = await analyzeFinances({
      totalIncome,
      totalExpenses,
      spendingByCategory,
      savingsGoals: (savingsGoals || []),
      monthlyTrend,
      currency,
    });

    // Save analysis to database
    const { data: analysis, error: saveError } = await supabase
      .from('financial_analyses')
      .upsert({
        user_id: user.id,
        month_year: monthYear,
        total_income: totalIncome,
        total_expenses: totalExpenses,
        amount_saved: Math.max(0, totalIncome - totalExpenses),
        budget_status: aiResult.budget_status,
        ai_analysis: aiResult.summary,
        ai_recommendations: aiResult.recommendations,
        spending_by_category: spendingByCategory,
      }, { onConflict: 'user_id,month_year' })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving analysis:', saveError);
    }

    return NextResponse.json({
      success: true,
      analysis: aiResult,
      savedAnalysis: analysis,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
