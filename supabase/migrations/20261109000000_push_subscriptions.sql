-- Morning notification (Spec 007): one row per phone or browser that turned on the reminder.
-- The endpoint is the address the browser gave us for sending notifications to that device.
create table public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users(id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  time_zone   text not null default 'America/Denver',
  created_at  timestamptz not null default now()
);

create index push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

-- Row Level Security: each user can only see and change their own devices.
-- The morning-reminder Edge Function reads every row with the service role key.
alter table public.push_subscriptions enable row level security;

create policy "own push: select" on public.push_subscriptions
  for select using (auth.uid() = user_id);
create policy "own push: insert" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy "own push: update" on public.push_subscriptions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own push: delete" on public.push_subscriptions
  for delete using (auth.uid() = user_id);

grant select, insert, update, delete on public.push_subscriptions to authenticated;
