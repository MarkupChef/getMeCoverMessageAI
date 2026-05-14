create extension if not exists "pgcrypto";

create type public.billing_subscription_status as enum (
  'trialing',
  'active',
  'past_due',
  'canceled',
  'incomplete'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'stripe',
  provider_customer_id text not null,
  created_at timestamptz not null default now(),
  unique (provider, provider_customer_id)
);

create table public.billing_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'stripe',
  provider_subscription_id text not null,
  status public.billing_subscription_status not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger billing_subscriptions_set_updated_at
before update on public.billing_subscriptions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.billing_customers enable row level security;
alter table public.billing_subscriptions enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can read their own billing customer"
on public.billing_customers for select
to authenticated
using (user_id = auth.uid());

create policy "Users can read their own billing subscription"
on public.billing_subscriptions for select
to authenticated
using (user_id = auth.uid());
