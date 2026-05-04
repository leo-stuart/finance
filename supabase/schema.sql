-- Run this in your Supabase SQL Editor

create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  type text check (type in ('income','expense','savings')) not null,
  color text not null default '#9fe870',
  created_at timestamptz default now()
);

create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  amount decimal(10,2) not null,
  type text check (type in ('income','expense','savings')) not null,
  category_id uuid references categories(id) on delete set null,
  description text default '',
  created_at timestamptz default now()
);

create table if not exists savings_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  target_amount decimal(10,2) not null,
  current_amount decimal(10,2) default 0,
  deadline date,
  created_at timestamptz default now()
);

-- Row Level Security
alter table categories enable row level security;
alter table transactions enable row level security;
alter table savings_goals enable row level security;

create policy "users own their categories" on categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users own their transactions" on transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users own their savings_goals" on savings_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
