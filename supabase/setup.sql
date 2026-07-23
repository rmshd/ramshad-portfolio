-- Run this entire file once in Supabase Dashboard > SQL Editor.

create table if not exists public.portfolio_items (
  id text primary key,
  title text not null check (char_length(title) between 1 and 150),
  category text not null check (char_length(category) between 1 and 100),
  type text not null check (type in ('image', 'video')),
  accent text not null default 'g' check (accent in ('g', 'b', 'o')),
  src text not null,
  storage_path text,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_items_created_at_idx
  on public.portfolio_items (created_at desc);

create table if not exists public.portfolio_messages (
  id text primary key,
  name text not null check (char_length(name) between 1 and 100),
  contact text,
  service text not null,
  project_type text,
  message text not null check (char_length(message) between 1 and 2000),
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_messages_created_at_idx
  on public.portfolio_messages (created_at desc);

alter table public.portfolio_items enable row level security;
alter table public.portfolio_messages enable row level security;

-- No public table policies are required. The Vercel API uses the private service-role key.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  262144000,
  array[
    'image/jpeg','image/png','image/webp','image/gif','image/avif','image/svg+xml',
    'video/mp4','video/webm','video/quicktime','video/x-m4v'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Portfolio starts empty. Add projects through /admin after deployment.
