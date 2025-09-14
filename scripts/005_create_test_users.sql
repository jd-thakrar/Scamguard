-- Create test user accounts for ScamGuard system
-- These are sample credentials for testing purposes

-- Test Admin User
-- Email: admin@scamguard.com
-- Password: Admin123!
-- Role: admin

-- Test Regular User  
-- Email: user@scamguard.com
-- Password: User123!
-- Role: user

-- Note: Users must sign up through the application first
-- Then run this script to assign proper roles

-- Update admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@scamguard.com';

-- Update regular user role (default is already 'user' but ensuring it's set)
UPDATE public.profiles 
SET role = 'user' 
WHERE email = 'user@scamguard.com';

-- Insert some sample analysis data for testing dashboards
INSERT INTO public.analyses (user_id, message_type, message_content, is_scam, confidence_score, detected_keywords, similar_examples, recommendations)
SELECT 
  p.id,
  'sms',
  'Congratulations! You have won $1000. Click here to claim: bit.ly/claim123',
  true,
  0.95,
  '["congratulations", "won", "click here", "claim"]'::jsonb,
  '["You have won a lottery", "Claim your prize now"]'::jsonb,
  '["Do not click any links", "Report as spam", "Block the sender"]'::jsonb
FROM public.profiles p 
WHERE p.email = 'user@scamguard.com'
LIMIT 1;

INSERT INTO public.analyses (user_id, message_type, message_content, is_scam, confidence_score, detected_keywords, similar_examples, recommendations)
SELECT 
  p.id,
  'email',
  'Your bank account has been compromised. Please verify your details immediately.',
  true,
  0.88,
  '["bank account", "compromised", "verify", "immediately"]'::jsonb,
  '["Account security alert", "Verify your identity"]'::jsonb,
  '["Contact your bank directly", "Do not provide personal information", "Report phishing"]'::jsonb
FROM public.profiles p 
WHERE p.email = 'user@scamguard.com'
LIMIT 1;

INSERT INTO public.analyses (user_id, message_type, message_content, is_scam, confidence_score, detected_keywords, similar_examples, recommendations)
SELECT 
  p.id,
  'sms',
  'Your package delivery is scheduled for today. Track: amazon.com/track/ABC123',
  false,
  0.15,
  '["package", "delivery", "track"]'::jsonb,
  '[]'::jsonb,
  '["Legitimate delivery notification"]'::jsonb
FROM public.profiles p 
WHERE p.email = 'user@scamguard.com'
LIMIT 1;
