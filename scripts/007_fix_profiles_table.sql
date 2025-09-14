-- Remove foreign key constraint and recreate profiles table without it
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    role text NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid()::text = id::text OR role = 'admin');

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Insert test profiles with specific UUIDs for easy reference
INSERT INTO public.profiles (id, email, role) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'admin@scamguard.com', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'user@scamguard.com', 'user');

-- Insert sample analysis data
INSERT INTO public.analyses (id, user_id, content, analysis_type, is_scam, confidence_score, detected_keywords, entities, risk_indicators) VALUES 
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Congratulations! You have won $1,000,000. Click here to claim your prize now!', 'email', true, 0.95, '["won", "prize", "click here", "claim"]', '{"suspicious_links": ["http://fake-site.com"]}', '{"urgency": true, "too_good_to_be_true": true}'),
    (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Your bank account has been temporarily suspended. Please verify your identity immediately.', 'sms', true, 0.88, '["suspended", "verify", "immediately"]', '{"impersonation": "bank"}', '{"urgency": true, "fear_tactics": true}'),
    (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Thank you for your recent purchase. Your order #12345 will be delivered tomorrow.', 'email', false, 0.12, '["purchase", "order", "delivered"]', '{"legitimate_business": true}', '{"normal_communication": true}');
