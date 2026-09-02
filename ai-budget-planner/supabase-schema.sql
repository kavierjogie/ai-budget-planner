-- ============================================================
-- AI Budget Planner — Supabase SQL Schema
-- ============================================================
-- Run this entire script in your Supabase SQL Editor.
-- Project: https://app.supabase.com/project/_/sql
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  currency      TEXT DEFAULT 'ZAR' NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- INCOME TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS income (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount                NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  source                TEXT NOT NULL,
  description           TEXT,
  date                  DATE NOT NULL,
  is_recurring          BOOLEAN DEFAULT FALSE,
  recurrence_interval   TEXT CHECK (recurrence_interval IN ('weekly', 'biweekly', 'monthly')),
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- EXPENSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS expenses (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount                NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  category              TEXT NOT NULL CHECK (category IN (
    'housing', 'food', 'transport', 'entertainment', 'healthcare',
    'education', 'clothing', 'utilities', 'savings', 'subscriptions',
    'personal_care', 'other'
  )),
  description           TEXT NOT NULL,
  date                  DATE NOT NULL,
  is_recurring          BOOLEAN DEFAULT FALSE,
  recurrence_interval   TEXT CHECK (recurrence_interval IN ('weekly', 'biweekly', 'monthly')),
  is_missed             BOOLEAN DEFAULT FALSE,
  month_year            TEXT NOT NULL,  -- Format: YYYY-MM
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- SAVINGS GOALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS savings_goals (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name              TEXT NOT NULL,
  description       TEXT,
  target_amount     NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
  current_amount    NUMERIC(12, 2) DEFAULT 0 NOT NULL CHECK (current_amount >= 0),
  target_date       DATE,
  duration_months   INTEGER CHECK (duration_months > 0),
  is_completed      BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- FINANCIAL ANALYSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_analyses (
  id                      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id                 UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month_year              TEXT NOT NULL,  -- Format: YYYY-MM
  total_income            NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  total_expenses          NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  amount_saved            NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  budget_status           TEXT CHECK (budget_status IN ('overspent', 'on_budget', 'under_budget')),
  ai_analysis             TEXT,
  ai_recommendations      TEXT[] DEFAULT '{}',
  spending_by_category    JSONB DEFAULT '{}',
  created_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, month_year)
);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type                  TEXT NOT NULL CHECK (type IN ('missed_expense', 'goal_progress', 'budget_alert', 'tip')),
  title                 TEXT NOT NULL,
  message               TEXT NOT NULL,
  is_read               BOOLEAN DEFAULT FALSE,
  related_expense_id    UUID REFERENCES expenses(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- INDEXES (for query performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_income_user_date ON income(user_id, date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_month ON expenses(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user ON savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_analyses_user ON financial_analyses(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_income_updated_at BEFORE UPDATE ON income FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_analyses_updated_at BEFORE UPDATE ON financial_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can ONLY access their own data.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- INCOME policies
CREATE POLICY "Users can view own income" ON income FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own income" ON income FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own income" ON income FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own income" ON income FOR DELETE USING (auth.uid() = user_id);

-- EXPENSES policies
CREATE POLICY "Users can view own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);

-- SAVINGS GOALS policies
CREATE POLICY "Users can view own goals" ON savings_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON savings_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON savings_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON savings_goals FOR DELETE USING (auth.uid() = user_id);

-- FINANCIAL ANALYSES policies
CREATE POLICY "Users can view own analyses" ON financial_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON financial_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own analyses" ON financial_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own analyses" ON financial_analyses FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATIONS policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, currency)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'ZAR'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- DONE ✓
-- Your database is ready for the AI Budget Planner.
-- ============================================================
