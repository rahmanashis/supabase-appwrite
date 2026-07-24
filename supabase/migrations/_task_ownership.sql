-- Task ownership and storage policies for Supabase Auth users.
--
-- Before enforcing NOT NULL on public.tasks.user_id, resolve any existing rows
-- where user_id is null. For playground data, delete or backfill those rows in
-- the Supabase SQL editor, then run:
--   alter table public.tasks alter column user_id set not null;

alter table public.tasks
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists tasks_user_id_created_at_idx
  on public.tasks (user_id, created_at desc);

alter table public.tasks enable row level security;

drop policy if exists "Users can read their own tasks" on public.tasks;
drop policy if exists "Users can create their own tasks" on public.tasks;
drop policy if exists "Users can update their own tasks" on public.tasks;
drop policy if exists "Users can delete their own tasks" on public.tasks;

create policy "Users can read their own tasks"
  on public.tasks
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own tasks"
  on public.tasks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- The app stores task images under `${auth.uid()}/file-name` in the
-- task-images bucket and reads them with public URLs. Keep the bucket public
-- only if public image reads are intentional for this app.
insert into storage.buckets (id, name, public)
values ('task-images', 'task-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Users can upload task images to their own folder" on storage.objects;
drop policy if exists "Users can update task images in their own folder" on storage.objects;
drop policy if exists "Users can delete task images from their own folder" on storage.objects;

create policy "Users can upload task images to their own folder"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'task-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update task images in their own folder"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'task-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'task-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete task images from their own folder"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'task-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
