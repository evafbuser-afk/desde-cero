-- Desde Cero — Supabase schema
-- Paste this into the Supabase SQL Editor and run it.

-- Enable UUID extension (already enabled in most Supabase projects)
create extension if not exists "uuid-ossp";

-- User profiles table
create table if not exists public.user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  name        text,
  onboarding_complete boolean default false,
  profile_data        jsonb,
  roadmap             jsonb,
  resume              jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- Row Level Security: users can only read/write their own profile
alter table public.user_profiles enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);
