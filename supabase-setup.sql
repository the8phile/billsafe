-- ============================================================
--  BillSafe — Supabase Database Setup
--  Run this entire file in your Supabase SQL Editor:
--  https://supabase.com → your project → SQL Editor → New query
-- ============================================================


-- 1. BILLS TABLE
-- Stores every bill a user uploads
create table if not exists public.bills (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade not null,
  company        text not null,                     -- 'ENEO', 'CamWater', 'Camtel', etc.
  status         text not null default 'paid',      -- 'paid' | 'pending' | 'overdue'
  billing_month  text,                              -- '2026-05'
  amount         numeric(12, 2),                   -- amount in FCFA
  payment_date   date,
  reference      text,                              -- bill reference number
  location       text,                              -- quartier / ville
  notes          text,
  file_url       text,                              -- public URL of uploaded file
  file_path      text,                              -- storage path for deletion
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- 2. ROW LEVEL SECURITY (RLS)
-- Users can only see and modify their own bills
alter table public.bills enable row level security;

create policy "Users see own bills"
  on public.bills for select
  using (auth.uid() = user_id);

create policy "Users insert own bills"
  on public.bills for insert
  with check (auth.uid() = user_id);

create policy "Users update own bills"
  on public.bills for update
  using (auth.uid() = user_id);

create policy "Users delete own bills"
  on public.bills for delete
  using (auth.uid() = user_id);

-- 3. AUTO UPDATE updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bills_updated_at
  before update on public.bills
  for each row execute function update_updated_at();

-- 4. PROFILES TABLE (optional — stores extra user info)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  city       text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users see own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users upsert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile when user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.phone
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- DONE! Now go to Storage and create a bucket called 'bills'
-- ============================================================
