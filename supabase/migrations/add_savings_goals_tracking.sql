-- Migration: add updated_at and next_update_date to savings_goals
-- Run this in Supabase SQL Editor for existing databases

alter table savings_goals
  add column if not exists next_update_date date,
  add column if not exists previous_amount decimal(10,2),
  add column if not exists updated_at timestamptz default now();

create or replace function update_savings_goals_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists savings_goals_updated_at on savings_goals;

create trigger savings_goals_updated_at
  before update on savings_goals
  for each row execute function update_savings_goals_updated_at();
