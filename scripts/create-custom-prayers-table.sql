-- Create custom_prayers table for Supabase
CREATE TABLE IF NOT EXISTS custom_prayers (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    section TEXT NOT NULL CHECK (section IN ('initium', 'ultima')),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_prayers_user_id ON custom_prayers(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_prayers_section ON custom_prayers(section);
CREATE INDEX IF NOT EXISTS idx_custom_prayers_active ON custom_prayers(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE custom_prayers ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own custom prayers" ON custom_prayers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom prayers" ON custom_prayers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom prayers" ON custom_prayers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom prayers" ON custom_prayers
    FOR DELETE USING (auth.uid() = user_id);