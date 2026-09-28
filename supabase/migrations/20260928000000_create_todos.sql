-- Todos: one row per to-do item, owned by a Supabase Auth user.
create table public.todos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid()
               references auth.users(id) on delete cascade,
  title        text not null check (char_length(title) between 1 and 500),
  notes        text,
  is_complete  boolean not null default false,
  due_date     date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index todos_user_id_idx on public.todos (user_id);

-- Row Level Security: each user can only see and change their own todos.
alter table public.todos enable row level security;

create policy "own todos: select" on public.todos
  for select using (auth.uid() = user_id);
create policy "own todos: insert" on public.todos
  for insert with check (auth.uid() = user_id);
create policy "own todos: update" on public.todos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own todos: delete" on public.todos
  for delete using (auth.uid() = user_id);

-- Keep updated_at current on every edit.
create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger todos_set_updated_at
  before update on public.todos
  for each row execute function public.set_updated_at();
