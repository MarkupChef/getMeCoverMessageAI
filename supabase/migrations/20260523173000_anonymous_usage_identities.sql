create table public.anonymous_usage_identities (
  id uuid primary key default gen_random_uuid(),
  usage_limit_id uuid not null references public.usage_limits(id) on delete cascade,
  anonymous_id_hash text,
  device_hash text,
  ip_hash text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint anonymous_usage_identities_signal_check check (
    anonymous_id_hash is not null
    or device_hash is not null
    or ip_hash is not null
  )
);

create unique index anonymous_usage_identities_anonymous_id_hash_key
on public.anonymous_usage_identities (anonymous_id_hash)
where anonymous_id_hash is not null;

create index anonymous_usage_identities_device_hash_idx
on public.anonymous_usage_identities (device_hash)
where device_hash is not null;

create index anonymous_usage_identities_expires_at_idx
on public.anonymous_usage_identities (expires_at);

create trigger anonymous_usage_identities_set_updated_at
before update on public.anonymous_usage_identities
for each row execute function public.set_updated_at();

alter table public.anonymous_usage_identities enable row level security;

revoke all on public.anonymous_usage_identities from anon, authenticated;
grant select, insert, update, delete on public.anonymous_usage_identities to service_role;

insert into public.anonymous_usage_identities (
  usage_limit_id,
  anonymous_id_hash,
  ip_hash,
  expires_at
)
select
  id,
  anonymous_id_hash,
  ip_hash,
  now() + interval '30 days'
from public.usage_limits
where anonymous_id_hash is not null
on conflict (anonymous_id_hash) where anonymous_id_hash is not null do nothing;

create or replace function public.consume_usage_limit(p_usage_limit_id uuid)
returns table (
  id uuid,
  free_generations_used int,
  free_generations_limit int,
  consumed boolean
)
language plpgsql
as $$
begin
  return query
  with updated as (
    update public.usage_limits usage_limit
    set free_generations_used = usage_limit.free_generations_used + 1
    where usage_limit.id = p_usage_limit_id
      and usage_limit.free_generations_used < usage_limit.free_generations_limit
    returning
      usage_limit.id,
      usage_limit.free_generations_used,
      usage_limit.free_generations_limit
  )
  select
    updated.id,
    updated.free_generations_used,
    updated.free_generations_limit,
    true
  from updated
  union all
  select
    usage_limit.id,
    usage_limit.free_generations_used,
    usage_limit.free_generations_limit,
    false
  from public.usage_limits usage_limit
  where usage_limit.id = p_usage_limit_id
    and not exists (select 1 from updated);
end;
$$;

revoke all on function public.consume_usage_limit(uuid) from public;
revoke all on function public.consume_usage_limit(uuid) from anon, authenticated;
grant execute on function public.consume_usage_limit(uuid) to service_role;
