-- Insert test user profiles directly into the profiles table
-- These will be linked to auth users when they sign up

-- Insert admin profile
INSERT INTO public.profiles (id, email, role, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'admin@scamguard.com',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Insert regular user profile
INSERT INTO public.profiles (id, email, role, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222'::uuid,
  'user@scamguard.com',
  'user',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Insert sample analysis data for the regular user
INSERT INTO public.analyses (
  id,
  user_id,
  content,
  analysis_type,
  is_scam,
  confidence_score,
  detected_keywords,
  entities,
  risk_indicators,
  created_at
) VALUES 
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Congratulations! You have won $1,000,000! Click here to claim your prize now!',
  'email',
  true,
  0.95,
  '["won", "prize", "click here", "claim"]'::jsonb,
  '["money", "urgency"]'::jsonb,
  '["suspicious_links", "too_good_to_be_true", "urgency_tactics"]'::jsonb,
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Your bank account has been temporarily suspended. Please verify your identity immediately.',
  'sms',
  true,
  0.88,
  '["suspended", "verify", "immediately"]'::jsonb,
  '["bank", "urgency"]'::jsonb,
  '["impersonation", "urgency_tactics", "credential_harvesting"]'::jsonb,
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Your order #12345 has been shipped and will arrive tomorrow. Track your package here.',
  'email',
  false,
  0.15,
  '["order", "shipped", "track"]'::jsonb,
  '["shipping", "legitimate_business"]'::jsonb,
  '[]'::jsonb,
  NOW() - INTERVAL '3 hours'
);
