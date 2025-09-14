-- Insert test profiles directly into the profiles table
-- These will be standalone profiles for testing

INSERT INTO public.profiles (id, email, role, created_at, updated_at) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'admin@scamguard.com',
  'admin',
  NOW(),
  NOW()
),
(
  '22222222-2222-2222-2222-222222222222',
  'user@scamguard.com',
  'user',
  NOW(),
  NOW()
);

-- Insert sample analysis data for testing dashboards
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
  '11111111-1111-1111-1111-111111111111',
  'Congratulations! You have won $1,000,000. Click here to claim your prize now!',
  'email',
  true,
  0.95,
  '["congratulations", "won", "prize", "click here", "claim"]'::jsonb,
  '["money", "urgency"]'::jsonb,
  '["suspicious_links", "too_good_to_be_true", "urgency_language"]'::jsonb,
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'Your account balance is $2,450.32. Thank you for banking with us.',
  'sms',
  false,
  0.15,
  '["account", "balance", "banking"]'::jsonb,
  '["financial_info"]'::jsonb,
  '[]'::jsonb,
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'URGENT: Your account will be suspended. Verify your identity immediately at fake-bank.com',
  'email',
  true,
  0.88,
  '["urgent", "suspended", "verify", "immediately"]'::jsonb,
  '["urgency", "threats"]'::jsonb,
  '["suspicious_domain", "urgency_language", "account_threats"]'::jsonb,
  NOW() - INTERVAL '3 hours'
);
