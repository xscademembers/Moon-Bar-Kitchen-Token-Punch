-- Moon Journey — run this in Supabase SQL Editor (Dashboard → SQL → New query)

create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone_e164 text unique not null,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_phone_e164_idx on public.customers (phone_e164);

create table if not exists public.staff_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_code text not null check (role_code in ('staff', 'manager', 'admin')),
  branch_code text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_punches (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  staff_user_id uuid references public.staff_users (id),
  punch_date date not null,
  slot_code text not null check (slot_code in ('morning', 'afternoon', 'night')),
  branch_code text not null default 'moon-bar',
  created_at timestamptz not null default now(),
  unique (customer_id, punch_date, slot_code)
);

create index if not exists customer_punches_customer_id_idx on public.customer_punches (customer_id);
create index if not exists customer_punches_punch_date_idx on public.customer_punches (punch_date);

create table if not exists public.rewards_catalog (
  reward_code text primary key,
  title text not null,
  reward_kind text not null check (reward_kind in ('standard', 'secret')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_rewards (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  reward_code text not null references public.rewards_catalog (reward_code),
  status text not null default 'issued' check (status in ('issued', 'redeemed', 'expired', 'cancelled')),
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  redeemed_at timestamptz
);

-- Seed default rewards (safe to re-run)
insert into public.rewards_catalog (reward_code, title, reward_kind)
values
  ('MOON-LATTE', 'Moon Latte Upgrade', 'standard'),
  ('CRATER-BONUS', 'Secret Crater Bonus', 'secret'),
  ('STREAK-3', '3-Day Streak Reward', 'standard')
on conflict (reward_code) do nothing;

alter table public.customers enable row level security;
alter table public.staff_users enable row level security;
alter table public.customer_punches enable row level security;
alter table public.rewards_catalog enable row level security;
alter table public.customer_rewards enable row level security;

-- Server API uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- Block direct public API access until customer auth is wired to Supabase.
create policy "customers_deny_anon" on public.customers for all to anon using (false);
create policy "customers_deny_authenticated" on public.customers for all to authenticated using (false);

create policy "punches_deny_anon" on public.customer_punches for all to anon using (false);
create policy "punches_deny_authenticated" on public.customer_punches for all to authenticated using (false);

create policy "staff_deny_anon" on public.staff_users for all to anon using (false);
create policy "staff_deny_authenticated" on public.staff_users for all to authenticated using (false);

create policy "rewards_catalog_deny_anon" on public.rewards_catalog for all to anon using (false);
create policy "rewards_catalog_deny_authenticated" on public.rewards_catalog for all to authenticated using (false);

create policy "customer_rewards_deny_anon" on public.customer_rewards for all to anon using (false);
create policy "customer_rewards_deny_authenticated" on public.customer_rewards for all to authenticated using (false);
