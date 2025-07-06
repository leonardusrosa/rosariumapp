import { supabase } from './lib/supabase';
import type { IStorage } from './storage';
import type { Prayer, InsertPrayer, Intention, InsertIntention, UserProfile, InsertUserProfile, CustomPrayer, InsertCustomPrayer } from '@shared/schema';

export class SupabaseStorage implements IStorage {
  private ensureSupabase() {
    if (!supabase) {
      throw new Error('Supabase client is not available. Check environment variables.');
    }
    return supabase;
  }
  async getUserPrayers(userId: string): Promise<Prayer[]> {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('prayers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createPrayer(prayer: InsertPrayer): Promise<Prayer> {
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

  async updatePrayerCompleted(id: number, completed: boolean): Promise<Prayer | undefined> {
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
    return data || undefined;
  }

  async getUserIntentions(userId: string): Promise<Intention[]> {
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

  async createIntention(intention: InsertIntention): Promise<Intention> {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('intentions')
      .insert({
        user_id: intention.userId,
        text: intention.text,
        is_active: intention.isActive !== false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteIntention(id: number, userId: string): Promise<boolean> {
    const client = this.ensureSupabase();
    const { error } = await client
      .from('intentions')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', userId);

    return !error;
  }

  async updateIntentionStatus(id: number, userId: string, isActive: boolean): Promise<Intention | undefined> {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('intentions')
      .update({ is_active: isActive })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async getUserProfileByUsername(username: string): Promise<UserProfile | undefined> {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data || undefined;
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    const client = this.ensureSupabase();
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data || undefined;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
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

  async updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const updateData: any = {};
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

  async getUserCustomPrayers(userId: string): Promise<CustomPrayer[]> {
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

  async createCustomPrayer(prayer: InsertCustomPrayer): Promise<CustomPrayer> {
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

  async updateCustomPrayer(id: number, userId: string, updates: Partial<InsertCustomPrayer>): Promise<CustomPrayer | undefined> {
    const updateData: any = {};
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
    return data || undefined;
  }

  async deleteCustomPrayer(id: number, userId: string): Promise<boolean> {
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
}