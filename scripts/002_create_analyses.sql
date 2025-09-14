-- Create analyses table to store fraud detection results
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  analysis_type text not null check (analysis_type in ('email', 'sms')),
  is_scam boolean not null,
  confidence_score decimal(3,2) not null check (confidence_score >= 0 and confidence_score <= 1),
  detected_keywords jsonb default '[]'::jsonb,
  entities jsonb default '{}'::jsonb,
  risk_indicators jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.analyses enable row level security;

-- RLS policies for analyses
create policy "analyses_select_own"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "analyses_insert_own"
  on public.analyses for insert
  with check (auth.uid() = user_id);

-- Admin can view all analyses
create policy "analyses_admin_select_all"
  on public.analyses for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create index for better performance
create index if not exists analyses_user_id_idx on public.analyses(user_id);
create index if not exists analyses_created_at_idx on public.analyses(created_at desc);
create index if not exists analyses_is_scam_idx on public.analyses(is_scam);
