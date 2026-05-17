insert into public.usage_limits (
  user_id,
  free_generations_used,
  free_generations_limit
)
select
  profiles.id,
  0,
  5
from public.profiles
on conflict (user_id) where user_id is not null do nothing;
