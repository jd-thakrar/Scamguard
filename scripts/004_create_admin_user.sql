-- Create a default admin user (you can change this email)
-- Note: This user will need to sign up normally first, then run this script
-- to upgrade their role to admin

-- Update the email below to your admin email
update public.profiles 
set role = 'admin' 
where email = 'admin@scamguard.com';

-- If no user exists with that email, you'll need to sign up first
-- then run this script to upgrade the role
