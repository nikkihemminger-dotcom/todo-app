-- Spec 009: an optional time of day on each to-do, and a life area for goals ("My goals").
alter table public.todos
  add column due_time time,
  add column area text check (area in ('academic', 'fitness', 'social', 'career', 'personal'));
