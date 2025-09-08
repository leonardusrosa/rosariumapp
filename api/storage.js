// Standalone storage for Vercel deployment
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export class SupabaseStorage {
  ensureSupabase() {
    if (!supabase) {
      throw new Error('Supabase client is not available. Check environment variables.');
    }
    return supabase;
  }

  async getUserPrayers(userId) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('prayers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createPrayer(prayer) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('prayers')
      .insert({
        user_id: prayer.userId,
        section: prayer.section,
        completed: prayer.completed || false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePrayerCompleted(id, completed) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('prayers')
      .update({ 
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserIntentions(userId) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('intentions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createIntention(intention) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('intentions')
      .insert({
        user_id: intention.userId,
        text: intention.text,
        is_active: intention.isActive ?? true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteIntention(id, userId) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('intentions')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return !!data;
  }

  async updateIntentionStatus(id, userId, isActive) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('intentions')
      .update({ is_active: isActive })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserCustomPrayers(userId) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('custom_prayers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createCustomPrayer(prayer) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('custom_prayers')
      .insert({
        user_id: prayer.userId,
        title: prayer.title,
        content: prayer.content,
        section: prayer.section,
        is_active: prayer.isActive ?? true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCustomPrayer(id, userId, updates) {
    const updateData = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.content) updateData.content = updates.content;
    if (updates.section) updateData.section = updates.section;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('custom_prayers')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCustomPrayer(id, userId) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('custom_prayers')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return !!data;
  }

  async getUserProfileByUsername(username) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data || undefined;
  }

  async getUserProfileByEmail(email) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data || undefined;
  }

  async createUserProfile(profile) {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('user_profiles')
      .insert({
        user_id: profile.userId,
        username: profile.username,
        email: profile.email,
        display_name: profile.displayName || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId, updates) {
    const updateData = {};
    if (updates.username) updateData.username = updates.username;
    if (updates.email) updateData.email = updates.email;
    if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
    
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data || undefined;
  }
}

export const storage = new SupabaseStorage();