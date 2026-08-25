-- ==========================================
-- Supabase SQL Table Schema & RLS Policies
-- Wafa Amjad — Full-Stack Developer Portfolio
-- ==========================================

-- Enable pgcrypto for generating UUIDs if not already loaded
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    email TEXT,
    bio TEXT,
    long_bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow public read access to profiles" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins to insert/update profiles" 
    ON public.profiles FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    detailed_description TEXT,
    category TEXT,
    technologies TEXT[] DEFAULT '{}'::TEXT[],
    image_url TEXT,
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT false NOT NULL,
    project_date DATE,
    highlights TEXT[] DEFAULT '{}'::TEXT[],
    role TEXT,
    database_tech TEXT,
    project_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects Policies
CREATE POLICY "Allow public read access to projects" 
    ON public.projects FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to projects" 
    ON public.projects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER DEFAULT 80 NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Skills Policies
CREATE POLICY "Allow public read access to skills" 
    ON public.skills FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to skills" 
    ON public.skills FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 4. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    responsibilities TEXT[] DEFAULT '{}'::TEXT[],
    technologies TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Experience Policies
CREATE POLICY "Allow public read access to experience" 
    ON public.experience FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to experience" 
    ON public.experience FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 5. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    grade TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Education Policies
CREATE POLICY "Allow public read access to education" 
    ON public.education FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to education" 
    ON public.education FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 6. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Certifications Policies
CREATE POLICY "Allow public read access to certifications" 
    ON public.certifications FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admins full access to certifications" 
    ON public.certifications FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 7. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages Policies
-- Public can ONLY insert (create) a message
CREATE POLICY "Allow public inserts on messages" 
    ON public.messages FOR INSERT WITH CHECK (true);

-- Authenticated admins can view, update, delete messages
CREATE POLICY "Allow authenticated admins full access to messages" 
    ON public.messages FOR ALL USING (auth.role() = 'authenticated');
