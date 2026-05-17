drop index if exists public.usage_limits_user_id_unique;
drop index if exists public.usage_limits_anonymous_id_hash_unique;

alter table public.usage_limits
add constraint usage_limits_user_id_key unique (user_id);

alter table public.usage_limits
add constraint usage_limits_anonymous_id_hash_key unique (anonymous_id_hash);
