-- =========================================================
-- Supabase SQL Migration & Policy Script
-- Wafa Amjad — Full-Stack Developer Portfolio
-- =========================================================
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Add updated_at column to profiles if missing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Automatic Profile Creation Trigger on Supabase Auth
-- Whenever a user is added to auth.users, a linked profile record is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, title)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'Wafa Amjad'),
        'Full-Stack Developer & Software Engineer'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent conflict errors
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated admins to insert/update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to delete profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated admins full access to profiles" ON public.profiles;

DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated admins full access to projects" ON public.projects;

DROP POLICY IF EXISTS "Allow public read access to skills" ON public.skills;
DROP POLICY IF EXISTS "Allow authenticated admins full access to skills" ON public.skills;

DROP POLICY IF EXISTS "Allow public read access to experience" ON public.experience;
DROP POLICY IF EXISTS "Allow authenticated admins full access to experience" ON public.experience;

DROP POLICY IF EXISTS "Allow public read access to education" ON public.education;
DROP POLICY IF EXISTS "Allow authenticated admins full access to education" ON public.education;

DROP POLICY IF EXISTS "Allow public read access to certifications" ON public.certifications;
DROP POLICY IF EXISTS "Allow authenticated admins full access to certifications" ON public.certifications;

DROP POLICY IF EXISTS "Allow public inserts on messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated admins full access to messages" ON public.messages;

-- 6. Create hardened RLS policies

-- -- PROFILES --
CREATE POLICY "Allow public read access to profiles" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete profile" 
    ON public.profiles FOR DELETE 
    USING (auth.role() = 'authenticated');

-- -- PROJECTS --
CREATE POLICY "Allow public read access to projects" 
    ON public.projects FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to projects" 
    ON public.projects FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

-- -- SKILLS --
CREATE POLICY "Allow public read access to skills" 
    ON public.skills FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to skills" 
    ON public.skills FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

-- -- EXPERIENCE --
CREATE POLICY "Allow public read access to experience" 
    ON public.experience FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to experience" 
    ON public.experience FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

-- -- EDUCATION --
CREATE POLICY "Allow public read access to education" 
    ON public.education FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to education" 
    ON public.education FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

-- -- CERTIFICATIONS --
CREATE POLICY "Allow public read access to certifications" 
    ON public.certifications FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to certifications" 
    ON public.certifications FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

-- -- MESSAGES --
CREATE POLICY "Allow public inserts on messages" 
    ON public.messages FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated admins full access to messages" 
    ON public.messages FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

-- 7. Backfill existing Supabase auth users into profiles (if any exist)
INSERT INTO public.profiles (id, email, name, title)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', 'Wafa Amjad'),
    'Full-Stack Developer & Software Engineer'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
