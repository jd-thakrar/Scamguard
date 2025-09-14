-- Remove any foreign key constraints on profiles table
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Remove any foreign key constraints on analyses table  
ALTER TABLE public.analyses DROP CONSTRAINT IF EXISTS analyses_user_id_fkey;

-- Insert test profiles
INSERT INTO public.profiles (id, email, role, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@scamguard.com', 'admin', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'user@scamguard.com', 'user', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Insert sample analysis data
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
-- Admin user analyses
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'URGENT: Your account will be suspended! Click here immediately to verify your identity.', 'email', true, 0.95, '["urgent", "suspended", "click here", "verify"]', '{"urls": ["http://fake-bank.com"], "phone_numbers": []}', '{"urgency": true, "suspicious_links": true, "impersonation": true}', NOW() - INTERVAL '2 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Your monthly statement is ready for review. Log in to your account to view details.', 'email', false, 0.15, '["statement", "account", "log in"]', '{"urls": ["https://secure-bank.com"], "phone_numbers": []}', '{"urgency": false, "suspicious_links": false, "impersonation": false}', NOW() - INTERVAL '1 day'),

-- Regular user analyses  
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Congratulations! You have won $10,000! Reply with your SSN to claim your prize.', 'sms', true, 0.98, '["congratulations", "won", "prize", "SSN"]', '{"urls": [], "phone_numbers": ["555-SCAM"]}', '{"urgency": true, "suspicious_links": false, "impersonation": true}', NOW() - INTERVAL '3 hours'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Your package delivery is scheduled for tomorrow between 2-4 PM. Track: PKG123456', 'sms', false, 0.05, '["delivery", "scheduled", "track"]', '{"urls": [], "phone_numbers": []}', '{"urgency": false, "suspicious_links": false, "impersonation": false}', NOW() - INTERVAL '1 hour');
