import Groq from 'groq-sdk';
import type {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
} from 'groq-sdk/resources/chat/completions';

const GROQ_MODEL_FALLBACKS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
  'qwen/qwen3.8-27b',
] as const;

type GroqModel = (typeof GROQ_MODEL_FALLBACKS)[number];
type ChatCompletionParams = ChatCompletionCreateParamsNonStreaming;

export function createGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

function getGroqErrorStatus(error: unknown) {
  if (typeof error !== 'object' || error === null) return undefined;

  const maybeStatus = (error as { status?: unknown; code?: unknown }).status ?? (error as { status?: unknown; code?: unknown }).code;
  return typeof maybeStatus === 'number' || typeof maybeStatus === 'string' ? maybeStatus : undefined;
}

function getGroqErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  return 'Unknown Groq error';
}

function shouldTryNextGroqModel(error: unknown) {
  const status = getGroqErrorStatus(error);
  const message = getGroqErrorMessage(error).toLowerCase();

  if ([401, 403, 408, 409, 429, 500, 502, 503, 504].includes(Number(status))) {
    return true;
  }

  if (status === 400 || status === 404 || status === 'model_not_found') {
    return true;
  }

  return [
    'model_not_found',
    'model not found',
    'does not exist',
    'decommissioned',
    'deprecated',
    'unavailable',
    'temporarily',
    'rate limit',
    'rate_limit',
    'overloaded',
    'server error',
  ].some(indicator => message.includes(indicator));
}

function shouldRetryWithoutJsonMode(error: unknown) {
  const message = getGroqErrorMessage(error).toLowerCase();

  return message.includes('response_format') || message.includes('json_object') || message.includes('json mode');
}

function logGroqAttempt(operation: string, model: GroqModel) {
  console.info(`[Groq] ${operation}: attempting model ${model}`);
}

function logGroqSuccess(operation: string, model: GroqModel) {
  console.info(`[Groq] ${operation}: succeeded with model ${model}`);
}

function logGroqFailure(operation: string, model: GroqModel, error: unknown) {
  const status = getGroqErrorStatus(error);
  const statusLabel = status ? `status ${status}` : 'no status';

  console.warn(`[Groq] ${operation}: model ${model} failed (${statusLabel}). Trying fallback if available.`);
}

async function createChatCompletionWithFallback(
  operation: string,
  buildParams: (model: GroqModel, options?: { jsonMode?: boolean }) => ChatCompletionParams,
): Promise<ChatCompletion> {
  const groq = createGroqClient();
  const failures: string[] = [];

  for (const model of GROQ_MODEL_FALLBACKS) {
    logGroqAttempt(operation, model);

    try {
      const completion = await groq.chat.completions.create(buildParams(model));
      logGroqSuccess(operation, model);
      return completion;
    } catch (error) {
      if (shouldRetryWithoutJsonMode(error)) {
        try {
          console.warn(`[Groq] ${operation}: model ${model} rejected JSON mode. Retrying same model without response_format.`);
          const completion = await groq.chat.completions.create(buildParams(model, { jsonMode: false }));
          logGroqSuccess(operation, model);
          return completion;
        } catch (jsonFallbackError) {
          failures.push(`${model}: ${getGroqErrorMessage(jsonFallbackError)}`);
          logGroqFailure(operation, model, jsonFallbackError);

          if (!shouldTryNextGroqModel(jsonFallbackError)) {
            throw jsonFallbackError;
          }

          continue;
        }
      }

      failures.push(`${model}: ${getGroqErrorMessage(error)}`);
      logGroqFailure(operation, model, error);

      if (!shouldTryNextGroqModel(error)) {
        throw error;
      }
    }
  }

  throw new Error(`Groq ${operation} failed with all configured models: ${failures.join(' | ')}`);
}

function parseJsonObject(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('AI response was not valid JSON');
    }

    return JSON.parse(jsonMatch[0]);
  }
}

export async function analyzeFinances(data: {
  totalIncome: number;
  totalExpenses: number;
  spendingByCategory: Record<string, number>;
  savingsGoals: Array<{ name: string; target_amount: number; current_amount: number }>;
  monthlyTrend: Array<{ month: string; income: number; expenses: number }>;
  currency: string;
}) {
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

  const completion = await createChatCompletionWithFallback('financial analysis', (model, options) => ({
    messages: [{ role: 'user', content: prompt }],
    model,
    temperature: 0.7,
    max_tokens: 1500,
    ...(options?.jsonMode === false ? {} : { response_format: { type: 'json_object' as const } }),
  }));

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  return parseJsonObject(content);
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

  const completion = await createChatCompletionWithFallback('financial advisor chat', model => ({
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    model,
    temperature: 0.8,
    max_tokens: 500,
  }));

  return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';
}
