-- Supabase Setup Script for Rosary Application
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security on auth.users (should already be enabled)
-- This is automatically handled by Supabase

-- Create the prayers table
CREATE TABLE IF NOT EXISTS public.prayers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  mystery_index INTEGER NOT NULL DEFAULT 0,
  prayer_index INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the intentions table
CREATE TABLE IF NOT EXISTS public.intentions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intentions ENABLE ROW LEVEL SECURITY;

-- Create policies for prayers table
CREATE POLICY "Users can view their own prayers" ON public.prayers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayers" ON public.prayers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayers" ON public.prayers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayers" ON public.prayers
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for intentions table
CREATE POLICY "Users can view their own intentions" ON public.intentions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own intentions" ON public.intentions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intentions" ON public.intentions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own intentions" ON public.intentions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS prayers_user_id_idx ON public.prayers(user_id);
CREATE INDEX IF NOT EXISTS prayers_section_idx ON public.prayers(section);
CREATE INDEX IF NOT EXISTS intentions_user_id_idx ON public.intentions(user_id);
CREATE INDEX IF NOT EXISTS intentions_active_idx ON public.intentions(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_prayers_updated_at 
  BEFORE UPDATE ON public.prayers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intentions_updated_at 
  BEFORE UPDATE ON public.intentions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();