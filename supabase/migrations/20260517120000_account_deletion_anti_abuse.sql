create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.deleted_user_guards (
  id uuid primary key default gen_random_uuid(),
  email_hash text,
  user_id_hash text,
  ip_hash text,
  device_hash text,
  free_generations_used int not null default 0,
  deleted_at timestamptz not null default now(),
  expires_at timestamptz not null,
  reason text not null default 'account_deleted',
  constraint deleted_user_guards_signal_check check (
    email_hash is not null
    or user_id_hash is not null
    or ip_hash is not null
    or device_hash is not null
  ),
  constraint deleted_user_guards_free_generations_used_check check (
    free_generations_used >= 0
  )
);

create table public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  anonymous_id_hash text unique,
  email_hash text,
  ip_hash text,
  free_generations_used int not null default 0,
  free_generations_limit int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint usage_limits_owner_check check (
    user_id is not null
    or anonymous_id_hash is not null
    or email_hash is not null
  ),
  constraint usage_limits_free_generations_used_check check (
    free_generations_used >= 0
  ),
  constraint usage_limits_free_generations_limit_check check (
    free_generations_limit > 0
  )
);

create index deleted_user_guards_email_hash_expires_at_idx
on public.deleted_user_guards (email_hash, expires_at)
where email_hash is not null;

create index deleted_user_guards_expires_at_idx
on public.deleted_user_guards (expires_at);

create index usage_limits_email_hash_idx
on public.usage_limits (email_hash)
where email_hash is not null;

create trigger usage_limits_set_updated_at
before update on public.usage_limits
for each row execute function public.set_updated_at();

alter table public.deleted_user_guards enable row level security;
alter table public.usage_limits enable row level security;

revoke all on public.deleted_user_guards from anon, authenticated;
revoke all on public.usage_limits from anon, authenticated;

grant select, insert, update, delete on public.deleted_user_guards to service_role;
grant select, insert, update, delete on public.usage_limits to service_role;
