-- Make takrarjeet05@gmail.com an admin user
UPDATE profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'takrarjeet05@gmail.com';

-- If the user doesn't exist yet, insert them as admin
INSERT INTO profiles (id, email, role, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'takrarjeet05@gmail.com',
  'admin',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'takrarjeet05@gmail.com'
);
