-- Fix infinite recursion in RLS policies
-- Drop existing problematic policies
drop policy if exists "profiles_admin_select_all" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

-- Create simple, non-recursive policies
-- Users can view their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Simple admin policy without recursion - check role directly from JWT claims
create policy "profiles_admin_select_all"
  on public.profiles for select
  using (
    (auth.jwt() ->> 'role')::text = 'admin'
    or 
    auth.uid() = id
  );

-- Enable service role access for admin operations
create policy "profiles_service_role_access"
  on public.profiles for all
  using (auth.role() = 'service_role');
