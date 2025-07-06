-- ===============================================
-- Supabase Custom Prayers Table Setup Script
-- ===============================================
-- Run this script in your Supabase SQL Editor
-- Project: Rosarium Virginis Mariae
-- Date: July 06, 2025
-- ===============================================

-- 1. Create custom_prayers table
CREATE TABLE IF NOT EXISTS public.custom_prayers (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    section TEXT NOT NULL CHECK (section IN ('initium', 'ultima')),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_prayers_user_id ON public.custom_prayers(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_prayers_section ON public.custom_prayers(section);
CREATE INDEX IF NOT EXISTS idx_custom_prayers_active ON public.custom_prayers(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_prayers_created_at ON public.custom_prayers(created_at);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.custom_prayers ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own custom prayers" ON public.custom_prayers;
DROP POLICY IF EXISTS "Users can insert their own custom prayers" ON public.custom_prayers;
DROP POLICY IF EXISTS "Users can update their own custom prayers" ON public.custom_prayers;
DROP POLICY IF EXISTS "Users can delete their own custom prayers" ON public.custom_prayers;

-- 5. Create RLS policies for authenticated users
CREATE POLICY "Users can view their own custom prayers" 
ON public.custom_prayers
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom prayers" 
ON public.custom_prayers
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom prayers" 
ON public.custom_prayers
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom prayers" 
ON public.custom_prayers
FOR DELETE 
USING (auth.uid() = user_id);

-- 6. Grant necessary permissions
GRANT ALL ON public.custom_prayers TO authenticated;
GRANT ALL ON public.custom_prayers TO service_role;

-- 7. Grant usage on the sequence
GRANT USAGE, SELECT ON SEQUENCE public.custom_prayers_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.custom_prayers_id_seq TO service_role;

-- ===============================================
-- Verification Queries (Optional - for testing)
-- ===============================================

-- Check if table was created successfully
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'custom_prayers' AND table_schema = 'public';

-- Check if indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename = 'custom_prayers' AND schemaname = 'public';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'custom_prayers' AND schemaname = 'public';

-- Check policies
SELECT policyname, tablename, cmd, roles 
FROM pg_policies 
WHERE tablename = 'custom_prayers' AND schemaname = 'public';

-- ===============================================
-- Sample Insert (Optional - for testing)
-- ===============================================
-- This will only work when logged in as a user
-- INSERT INTO public.custom_prayers (user_id, title, content, section)
-- VALUES (auth.uid(), 'Oração Teste', 'Esta é uma oração de teste para verificar o funcionamento da tabela.', 'initium');