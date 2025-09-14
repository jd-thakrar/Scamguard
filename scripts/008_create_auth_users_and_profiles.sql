-- Create test users in auth.users and corresponding profiles
-- Note: This approach creates users directly in auth.users which may not work in all Supabase setups
-- Alternative: Use the test-login page to create users through the auth API

-- First, let's create a function to safely insert test data
create or replace function create_test_user_profile(
  user_id uuid,
  user_email text,
  user_role text default 'user'
)
returns void
language plpgsql
security definer
as $$
begin
  -- Insert into auth.users if it doesn't exist
  insert into auth.users (
    id,
    email,
    email_confirmed_at,
    created_at,
    updated_at,
    aud,
    role
  )
  values (
    user_id,
    user_email,
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated'
  )
  on conflict (id) do nothing;

  -- Insert into profiles
  insert into public.profiles (id, email, role)
  values (user_id, user_email, user_role)
  on conflict (id) do update set
    email = excluded.email,
    role = excluded.role,
    updated_at = now();
end;
$$;

-- Create admin user
select create_test_user_profile(
  '11111111-1111-1111-1111-111111111111'::uuid,
  'admin@scamguard.com',
  'admin'
);

-- Create regular user
select create_test_user_profile(
  '22222222-2222-2222-2222-222222222222'::uuid,
  'user@scamguard.com',
  'user'
);

-- Insert sample analysis data for the test users
insert into public.analyses (
  id,
  user_id,
  message_type,
  content,
  is_scam,
  confidence_score,
  keywords,
  similar_examples,
  recommendations
) values
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'email',
  'Congratulations! You have won $1,000,000. Click here to claim your prize now!',
  true,
  0.95,
  '["won", "prize", "click here", "congratulations"]',
  '["You have won a lottery", "Claim your prize now", "Urgent action required"]',
  '["Never click suspicious links", "Verify sender identity", "Report to authorities"]'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'sms',
  'Your bank account has been temporarily suspended. Please call 555-0123 immediately.',
  true,
  0.88,
  '["suspended", "immediately", "call"]',
  '["Account suspended", "Urgent bank notice", "Call immediately"]',
  '["Contact your bank directly", "Do not call unknown numbers", "Verify through official channels"]'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'email',
  'Your monthly bank statement is now available. Log in to your account to view.',
  false,
  0.15,
  '["monthly", "statement", "log in"]',
  '["Regular bank communication", "Account statement", "Official notification"]',
  '["This appears to be legitimate", "Always verify sender", "Use official banking app"]'
);

-- Clean up the function
drop function if exists create_test_user_profile(uuid, text, text);
