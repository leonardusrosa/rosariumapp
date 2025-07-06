import { prayers, intentions, userProfiles, customPrayers, type Prayer, type InsertPrayer, type Intention, type InsertIntention, type UserProfile, type InsertUserProfile, type CustomPrayer, type InsertCustomPrayer } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Prayer methods
  getUserPrayers(userId: string): Promise<Prayer[]>;
  createPrayer(prayer: InsertPrayer): Promise<Prayer>;
  updatePrayerCompleted(id: number, completed: boolean): Promise<Prayer | undefined>;
  
  // Intention methods
  getUserIntentions(userId: string): Promise<Intention[]>;
  createIntention(intention: InsertIntention): Promise<Intention>;
  deleteIntention(id: number, userId: string): Promise<boolean>;
  updateIntentionStatus(id: number, userId: string, isActive: boolean): Promise<Intention | undefined>;
  
  // Custom prayer methods
  getUserCustomPrayers(userId: string): Promise<CustomPrayer[]>;
  createCustomPrayer(prayer: InsertCustomPrayer): Promise<CustomPrayer>;
  updateCustomPrayer(id: number, userId: string, updates: Partial<InsertCustomPrayer>): Promise<CustomPrayer | undefined>;
  deleteCustomPrayer(id: number, userId: string): Promise<boolean>;
  
  // User profile methods
  getUserProfileByUsername(username: string): Promise<UserProfile | undefined>;
  getUserProfileByEmail(email: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
}

export class MemStorage implements IStorage {
  private prayers: Map<number, Prayer>;
  private intentions: Map<number, Intention>;
  private userProfiles: Map<string, UserProfile>;
  private customPrayers: Map<number, CustomPrayer>;
  private currentPrayerId: number;
  private currentIntentionId: number;
  private currentProfileId: number;
  private currentCustomPrayerId: number;

  constructor() {
    this.prayers = new Map();
    this.intentions = new Map();
    this.userProfiles = new Map();
    this.customPrayers = new Map();
    this.currentPrayerId = 1;
    this.currentIntentionId = 1;
    this.currentProfileId = 1;
    this.currentCustomPrayerId = 1;
  }

  async getUserPrayers(userId: string): Promise<Prayer[]> {
    return Array.from(this.prayers.values()).filter(
      (prayer) => prayer.userId === userId,
    );
  }

  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const id = this.currentPrayerId++;
    const prayer: Prayer = {
      ...insertPrayer,
      id,
      completed: insertPrayer.completed ?? false,
      completedAt: null,
      createdAt: new Date()
    };
    this.prayers.set(id, prayer);
    return prayer;
  }

  async updatePrayerCompleted(id: number, completed: boolean): Promise<Prayer | undefined> {
    const prayer = this.prayers.get(id);
    if (!prayer) return undefined;
    
    const updatedPrayer = {
      ...prayer,
      completed,
      completedAt: completed ? new Date() : null
    };
    this.prayers.set(id, updatedPrayer);
    return updatedPrayer;
  }

  async getUserIntentions(userId: string): Promise<Intention[]> {
    return Array.from(this.intentions.values()).filter(
      (intention) => intention.userId === userId && intention.isActive,
    );
  }

  async createIntention(insertIntention: InsertIntention): Promise<Intention> {
    const id = this.currentIntentionId++;
    const intention: Intention = {
      ...insertIntention,
      id,
      isActive: insertIntention.isActive ?? true,
      createdAt: new Date()
    };
    this.intentions.set(id, intention);
    return intention;
  }

  async deleteIntention(id: number, userId: string): Promise<boolean> {
    const intention = this.intentions.get(id);
    if (!intention || intention.userId !== userId) return false;
    
    return this.intentions.delete(id);
  }

  async updateIntentionStatus(id: number, userId: string, isActive: boolean): Promise<Intention | undefined> {
    const intention = this.intentions.get(id);
    if (!intention || intention.userId !== userId) return undefined;
    
    const updatedIntention = {
      ...intention,
      isActive
    };
    this.intentions.set(id, updatedIntention);
    return updatedIntention;
  }

  async getUserCustomPrayers(userId: string): Promise<CustomPrayer[]> {
    return Array.from(this.customPrayers.values()).filter(
      (prayer) => prayer.userId === userId && prayer.isActive,
    );
  }

  async createCustomPrayer(insertCustomPrayer: InsertCustomPrayer): Promise<CustomPrayer> {
    const id = this.currentCustomPrayerId++;
    const customPrayer: CustomPrayer = {
      ...insertCustomPrayer,
      id,
      isActive: insertCustomPrayer.isActive ?? true,
      createdAt: new Date(),
    };
    this.customPrayers.set(id, customPrayer);
    return customPrayer;
  }

  async updateCustomPrayer(id: number, userId: string, updates: Partial<InsertCustomPrayer>): Promise<CustomPrayer | undefined> {
    const customPrayer = this.customPrayers.get(id);
    if (!customPrayer || customPrayer.userId !== userId) return undefined;
    
    const updatedCustomPrayer = {
      ...customPrayer,
      ...updates,
    };
    this.customPrayers.set(id, updatedCustomPrayer);
    return updatedCustomPrayer;
  }

  async deleteCustomPrayer(id: number, userId: string): Promise<boolean> {
    const customPrayer = this.customPrayers.get(id);
    if (!customPrayer || customPrayer.userId !== userId) return false;
    
    return this.customPrayers.delete(id);
  }

  async getUserProfileByUsername(username: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(profile => profile.username === username);
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(profile => profile.email === email);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = this.currentProfileId++;
    const profile: UserProfile = {
      ...insertProfile,
      id,
      displayName: insertProfile.displayName || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userProfiles.set(profile.userId, profile);
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return undefined;
    
    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date()
    };
    this.userProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }
}

// PostgreSQL Storage Implementation
export class PostgreSQLStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async getUserPrayers(userId: string): Promise<Prayer[]> {
    return await this.db.select().from(prayers).where(eq(prayers.userId, userId));
  }

  async createPrayer(prayer: InsertPrayer): Promise<Prayer> {
    const result = await this.db.insert(prayers).values(prayer).returning();
    return result[0];
  }

  async updatePrayerCompleted(id: number, completed: boolean): Promise<Prayer | undefined> {
    const result = await this.db
      .update(prayers)
      .set({ 
        completed, 
        completedAt: completed ? new Date() : null 
      })
      .where(eq(prayers.id, id))
      .returning();
    
    return result[0];
  }

  async getUserIntentions(userId: string): Promise<Intention[]> {
    return await this.db
      .select()
      .from(intentions)
      .where(and(eq(intentions.userId, userId), eq(intentions.isActive, true)));
  }

  async createIntention(intention: InsertIntention): Promise<Intention> {
    const result = await this.db.insert(intentions).values(intention).returning();
    return result[0];
  }

  async deleteIntention(id: number, userId: string): Promise<boolean> {
    const result = await this.db
      .update(intentions)
      .set({ isActive: false })
      .where(and(eq(intentions.id, id), eq(intentions.userId, userId)))
      .returning();
    
    return result.length > 0;
  }

  async updateIntentionStatus(id: number, userId: string, isActive: boolean): Promise<Intention | undefined> {
    const result = await this.db
      .update(intentions)
      .set({ isActive })
      .where(and(eq(intentions.id, id), eq(intentions.userId, userId)))
      .returning();
    
    return result[0];
  }

  async getUserCustomPrayers(userId: string): Promise<CustomPrayer[]> {
    return await this.db
      .select()
      .from(customPrayers)
      .where(and(eq(customPrayers.userId, userId), eq(customPrayers.isActive, true)));
  }

  async createCustomPrayer(prayer: InsertCustomPrayer): Promise<CustomPrayer> {
    const result = await this.db.insert(customPrayers).values(prayer).returning();
    return result[0];
  }

  async updateCustomPrayer(id: number, userId: string, updates: Partial<InsertCustomPrayer>): Promise<CustomPrayer | undefined> {
    const result = await this.db
      .update(customPrayers)
      .set(updates)
      .where(and(eq(customPrayers.id, id), eq(customPrayers.userId, userId)))
      .returning();
    
    return result[0];
  }

  async deleteCustomPrayer(id: number, userId: string): Promise<boolean> {
    const result = await this.db
      .update(customPrayers)
      .set({ isActive: false })
      .where(and(eq(customPrayers.id, id), eq(customPrayers.userId, userId)))
      .returning();
    
    return result.length > 0;
  }

  async getUserProfileByUsername(username: string): Promise<UserProfile | undefined> {
    const result = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.username, username))
      .limit(1);
    
    return result[0];
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    const result = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.email, email))
      .limit(1);
    
    return result[0];
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const result = await this.db.insert(userProfiles).values(profile).returning();
    return result[0];
  }

  async updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const result = await this.db
      .update(userProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    
    return result[0];
  }
}

import { SupabaseStorage } from './supabase-storage';

// Always use Supabase storage - guest mode removed
export const storage = new SupabaseStorage();