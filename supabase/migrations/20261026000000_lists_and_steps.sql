-- Lists: each to-do belongs to one list (School, Goals, Chores, ...), owned by a user.
create table public.lists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 60),
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index lists_user_id_idx on public.lists (user_id);

alter table public.lists enable row level security;

create policy "own lists: select" on public.lists
  for select using (auth.uid() = user_id);
create policy "own lists: insert" on public.lists
  for insert with check (auth.uid() = user_id);
create policy "own lists: update" on public.lists
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own lists: delete" on public.lists
  for delete using (auth.uid() = user_id);

grant select, insert, update, delete on public.lists to authenticated;

-- Steps are to-dos with a parent (from "Break it down" or added by hand).
-- Deleting a list deletes its to-dos; deleting a to-do deletes its steps.
alter table public.todos
  add column list_id    uuid references public.lists(id) on delete cascade,
  add column parent_id  uuid references public.todos(id) on delete cascade,
  add column position   integer not null default 0;

create index todos_list_id_idx on public.todos (list_id);
create index todos_parent_id_idx on public.todos (parent_id);

-- A to-do may only point at the user's own list and own parent to-do.
create function public.owns_list(lid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select lid is null or exists (select 1 from public.lists where id = lid and user_id = auth.uid());
$$;
create function public.owns_todo(tid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select tid is null or exists (select 1 from public.todos where id = tid and user_id = auth.uid());
$$;

drop policy "own todos: insert" on public.todos;
drop policy "own todos: update" on public.todos;

create policy "own todos: insert" on public.todos
  for insert with check (
    auth.uid() = user_id and public.owns_list(list_id) and public.owns_todo(parent_id)
  );
create policy "own todos: update" on public.todos
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id and public.owns_list(list_id) and public.owns_todo(parent_id)
  );
