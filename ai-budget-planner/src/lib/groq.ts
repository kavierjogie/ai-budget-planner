import Groq from 'groq-sdk';

export function createGroqClient() {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY!,
  });
}

export async function analyzeFinances(data: {
  totalIncome: number;
  totalExpenses: number;
  spendingByCategory: Record<string, number>;
  savingsGoals: Array<{ name: string; target_amount: number; current_amount: number }>;
  monthlyTrend: Array<{ month: string; income: number; expenses: number }>;
  currency: string;
}) {
  const groq = createGroqClient();

  const prompt = `You are an expert financial advisor analyzing a user's budget. Provide a thorough, personalized analysis.

Financial Data:
- Total Income: ${data.currency} ${data.totalIncome.toFixed(2)}
- Total Expenses: ${data.currency} ${data.totalExpenses.toFixed(2)}
- Net Balance: ${data.currency} ${(data.totalIncome - data.totalExpenses).toFixed(2)}
- Savings Rate: ${((1 - data.totalExpenses / data.totalIncome) * 100).toFixed(1)}%

Spending by Category:
${Object.entries(data.spendingByCategory)
  .sort(([, a], [, b]) => b - a)
  .map(([cat, amount]) => `- ${cat}: ${data.currency} ${amount.toFixed(2)} (${((amount / data.totalIncome) * 100).toFixed(1)}% of income)`)
  .join('\n')}

Savings Goals:
${data.savingsGoals.length > 0
  ? data.savingsGoals.map(g => `- ${g.name}: ${data.currency} ${g.current_amount.toFixed(2)} / ${data.currency} ${g.target_amount.toFixed(2)} (${((g.current_amount / g.target_amount) * 100).toFixed(1)}%)`).join('\n')
  : '- No savings goals set'}

Recent Monthly Trend (last months):
${data.monthlyTrend.slice(-3).map(m => `- ${m.month}: Income ${data.currency} ${m.income.toFixed(2)}, Expenses ${data.currency} ${m.expenses.toFixed(2)}`).join('\n')}

Provide a JSON response with exactly this structure:
{
  "budget_status": "overspent" | "on_budget" | "under_budget",
  "summary": "2-3 sentence overall assessment",
  "overspending_patterns": ["pattern 1", "pattern 2"],
  "high_spend_categories": ["category 1", "category 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4", "recommendation 5"],
  "positive_habits": ["positive habit 1", "positive habit 2"],
  "monthly_savings_suggestion": number
}

Be specific, actionable, and encouraging. Reference actual numbers from the data.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  return JSON.parse(content);
}

export async function chatWithFinancialAdvisor(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  financialContext: {
    totalIncome: number;
    totalExpenses: number;
    spendingByCategory: Record<string, number>;
    savingsGoals: Array<{ name: string; target_amount: number; current_amount: number }>;
    currency: string;
    budgetStatus: string;
  }
) {
  const groq = createGroqClient();

  const systemPrompt = `You are a friendly, knowledgeable financial advisor chatbot for a budget planning app. 
You have access to the user's financial data and should provide personalized, actionable advice.

User's Current Financial Summary:
- Monthly Income: ${financialContext.currency} ${financialContext.totalIncome.toFixed(2)}
- Monthly Expenses: ${financialContext.currency} ${financialContext.totalExpenses.toFixed(2)}
- Available Balance: ${financialContext.currency} ${(financialContext.totalIncome - financialContext.totalExpenses).toFixed(2)}
- Budget Status: ${financialContext.budgetStatus}
- Top Spending Categories: ${Object.entries(financialContext.spendingByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat, amt]) => `${cat} (${financialContext.currency} ${amt.toFixed(2)})`)
    .join(', ')}
- Savings Goals: ${financialContext.savingsGoals.length > 0
    ? financialContext.savingsGoals.map(g => `${g.name}: ${((g.current_amount / g.target_amount) * 100).toFixed(0)}% complete`).join(', ')
    : 'None set'}

Keep responses concise (2-4 sentences), warm, and practical. Use the user's actual financial data when relevant. 
If asked about specific numbers, reference the data above. Encourage healthy financial habits.`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.8,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';
}
