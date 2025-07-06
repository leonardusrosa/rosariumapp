import { prayers, intentions, type Prayer, type InsertPrayer, type Intention, type InsertIntention } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prayers: Map<number, Prayer>;
  private intentions: Map<number, Intention>;
  private currentUserId: number;
  private currentPrayerId: number;
  private currentIntentionId: number;

  constructor() {
    this.users = new Map();
    this.prayers = new Map();
    this.intentions = new Map();
    this.currentUserId = 1;
    this.currentPrayerId = 1;
    this.currentIntentionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserPrayers(userId: number): Promise<Prayer[]> {
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

  async getUserIntentions(userId: number): Promise<Intention[]> {
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

  async deleteIntention(id: number, userId: number): Promise<boolean> {
    const intention = this.intentions.get(id);
    if (!intention || intention.userId !== userId) return false;
    
    return this.intentions.delete(id);
  }

  async updateIntentionStatus(id: number, userId: number, isActive: boolean): Promise<Intention | undefined> {
    const intention = this.intentions.get(id);
    if (!intention || intention.userId !== userId) return undefined;
    
    const updatedIntention = { ...intention, isActive };
    this.intentions.set(id, updatedIntention);
    return updatedIntention;
  }

  // Simple password verification for MemStorage (no hashing in memory storage)
  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    return user && user.password === password ? user : null;
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

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const result = await this.db.insert(users).values({
      username: insertUser.username,
      password: hashedPassword,
    }).returning();
    
    return result[0];
  }

  async getUserPrayers(userId: number): Promise<Prayer[]> {
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

  async getUserIntentions(userId: number): Promise<Intention[]> {
    return await this.db
      .select()
      .from(intentions)
      .where(and(eq(intentions.userId, userId), eq(intentions.isActive, true)));
  }

  async createIntention(intention: InsertIntention): Promise<Intention> {
    const result = await this.db.insert(intentions).values(intention).returning();
    return result[0];
  }

  async deleteIntention(id: number, userId: number): Promise<boolean> {
    const result = await this.db
      .update(intentions)
      .set({ isActive: false })
      .where(and(eq(intentions.id, id), eq(intentions.userId, userId)))
      .returning();
    
    return result.length > 0;
  }

  async updateIntentionStatus(id: number, userId: number, isActive: boolean): Promise<Intention | undefined> {
    const result = await this.db
      .update(intentions)
      .set({ isActive })
      .where(and(eq(intentions.id, id), eq(intentions.userId, userId)))
      .returning();
    
    return result[0];
  }

  // Helper method for authentication
  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}

// Use PostgreSQL storage in production, MemStorage for development if needed
export const storage = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL 
  ? new PostgreSQLStorage() 
  : new MemStorage();
