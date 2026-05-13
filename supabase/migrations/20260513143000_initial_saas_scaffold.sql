create extension if not exists "pgcrypto";

create type public.membership_role as enum ('owner', 'admin', 'member');
create type public.invitation_status as enum ('pending', 'accepted', 'revoked', 'expired');
create type public.invitation_role as enum ('admin', 'member');
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

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.membership_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role public.invitation_role not null default 'member',
  status public.invitation_status not null default 'pending',
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.billing_customers (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  provider text not null default 'stripe',
  provider_customer_id text not null,
  created_at timestamptz not null default now(),
  unique (provider, provider_customer_id)
);

create table public.billing_subscriptions (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  provider text not null default 'stripe',
  provider_subscription_id text not null,
  status public.billing_subscription_status not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);

create index memberships_user_id_idx on public.memberships(user_id);
create index memberships_organization_id_idx on public.memberships(organization_id);
create index invitations_organization_id_idx on public.invitations(organization_id);
create index invitations_email_idx on public.invitations(lower(email));

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

create trigger organizations_set_updated_at
before update on public.organizations
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

create schema if not exists private;

create or replace function private.has_organization_role(
  target_organization_id uuid,
  allowed_roles public.membership_role[] default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.organization_id = target_organization_id
      and m.user_id = auth.uid()
      and (allowed_roles is null or m.role = any(allowed_roles))
  );
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.invitations enable row level security;
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

create policy "Members can read organizations"
on public.organizations for select
to authenticated
using (private.has_organization_role(organizations.id));

create policy "Owners and admins can update organizations"
on public.organizations for update
to authenticated
using (private.has_organization_role(organizations.id, array['owner', 'admin']::public.membership_role[]))
with check (private.has_organization_role(organizations.id, array['owner', 'admin']::public.membership_role[]));

create policy "Authenticated users can create organizations"
on public.organizations for insert
to authenticated
with check (true);

create policy "Members can read memberships in their organizations"
on public.memberships for select
to authenticated
using (private.has_organization_role(memberships.organization_id));

create policy "Owners and admins manage memberships"
on public.memberships for all
to authenticated
using (private.has_organization_role(memberships.organization_id, array['owner', 'admin']::public.membership_role[]))
with check (private.has_organization_role(memberships.organization_id, array['owner', 'admin']::public.membership_role[]));

create policy "Authenticated users can claim first organization membership"
on public.memberships for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'owner'
  and not exists (
    select 1
    from public.memberships existing
    where existing.organization_id = memberships.organization_id
  )
);

create policy "Owners and admins manage invitations"
on public.invitations for all
to authenticated
using (private.has_organization_role(invitations.organization_id, array['owner', 'admin']::public.membership_role[]))
with check (private.has_organization_role(invitations.organization_id, array['owner', 'admin']::public.membership_role[]));

create policy "Members can read billing customers"
on public.billing_customers for select
to authenticated
using (private.has_organization_role(billing_customers.organization_id));

create policy "Members can read billing subscriptions"
on public.billing_subscriptions for select
to authenticated
using (private.has_organization_role(billing_subscriptions.organization_id));
