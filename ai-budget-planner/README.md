# BudgetAI — AI-Powered Budget Planner

A full-stack budget planning app for young adults. Track income and expenses, get AI-powered spending analysis, chat with a financial advisor, and work toward your savings goals.

---

## Features

- **Authentication** — Sign up, log in, log out via Supabase Auth
- **Dashboard** — Live overview of income, expenses, savings, and 6-month trends
- **Income & Expenses** — Add, edit, delete; categorise expenses; mark recurring items
- **AI Spending Analysis** — Powered by Groq (Llama 3.3 70B); identifies overspending patterns and gives personalised recommendations
- **AI Finance Chatbot** — Floating chat assistant with full access to your financial context
- **Savings Goals** — Create goals, deposit savings, track progress with visual progress bars
- **Recurring Expense Tracking** — Recurring items are automatically carried forward each month
- **Notifications** — Alerts for recurring expenses, missed items, and budget events
- **Financial History** — Month-by-month record of income, expenses, and AI analyses
- **PDF Reports** — Download a beautifully formatted spending report for any month

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| Backend & Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| AI | Groq API (Llama 3.3 70B) |
| Charts | Recharts |
| PDF | jsPDF + jspdf-autotable |
| Deployment | Vercel |

---

## Prerequisites

- Node.js 18.17+
- A free [Supabase](https://supabase.com) account
- A free [Groq](https://console.groq.com) account

---

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd ai-budget-planner
npm install
```

---

## 2. Set Up Supabase

### Create a project
1. Go to https://app.supabase.com → **New project**
2. Wait for provisioning (~1 min)

### Run the database schema
1. Go to **SQL Editor** in your Supabase project
2. Click **New query**
3. Copy the full contents of `supabase-schema.sql`
4. Paste and click **Run**

This creates all tables, RLS policies, indexes, and triggers (including auto-profile creation on signup).

### Get your API keys
Go to **Settings → API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role / secret** → `SUPABASE_SERVICE_ROLE_KEY`

### Disable email confirmation (for local dev)
Go to **Authentication → Providers → Email** → toggle **Confirm email** OFF.

---

## 3. Get a Groq API Key

1. Go to https://console.groq.com/keys
2. Create an API key → `GROQ_API_KEY`

Groq is free to start and extremely fast. The app uses `llama-3.3-70b-versatile`.

---

## 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GROQ_API_KEY=gsk_your_groq_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. Run Locally

```bash
npm run dev
```

Open http://localhost:3000 — you'll be redirected to login. Create an account and start budgeting.

---

## Project Structure

```
src/
├── app/
│   ├── auth/           login, signup, callback
│   ├── dashboard/      overview, income, expenses, goals, history, notifications
│   └── api/            analyze, chat, recurring-expenses
├── components/
│   ├── ui/             Button, Card, Input, Select, Modal, Badge, EmptyState
│   ├── charts/         SpendingChart (pie), TrendChart (bar)
│   ├── dashboard/      Sidebar, IncomeForm, ExpenseForm, GoalForm
│   └── chatbot/        ChatBot (floating AI assistant)
├── lib/
│   ├── supabase/       client.ts, server.ts
│   ├── groq.ts         AI analysis + chat
│   ├── pdf.ts          PDF report generation
│   └── utils.ts        formatCurrency, dates, helpers
├── types/index.ts      All TypeScript interfaces
└── middleware.ts       Route protection
```

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo at https://vercel.com → **Add New Project**
3. Add all 5 environment variables under **Environment Variables**
4. Deploy

After deploying, add your Vercel URL to Supabase:
**Authentication → URL Configuration → Redirect URLs**:
```
https://your-app.vercel.app/auth/callback
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page after login | Check Supabase URL and anon key |
| AI analysis fails | Verify `GROQ_API_KEY` is correct |
| Tables not found | Re-run `supabase-schema.sql` |
| Auth loop on signup | Disable email confirmation in Supabase (dev) |

---

## License

MIT
