create table if not exists credit_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  closing_day integer not null check (closing_day between 1 and 31),
  due_day integer not null check (due_day between 1 and 31),
  limit_amount decimal(10,2),
  color text not null default '#9fe870',
  created_at timestamptz default now()
);

create table if not exists credit_card_charges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  credit_card_id uuid references credit_cards(id) on delete cascade not null,
  purchase_date date not null,
  amount decimal(10,2) not null,
  description text not null default '',
  category_id uuid references categories(id) on delete set null,
  installments integer not null default 1 check (installments between 1 and 48),

  created_at timestamptz default now()
);

alter table credit_cards enable row level security;
alter table credit_card_charges enable row level security;

create policy "users own their credit_cards" on credit_cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users own their credit_card_charges" on credit_card_charges
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
