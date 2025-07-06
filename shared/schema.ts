import { pgTable, text, serial, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profiles table to store additional user data and enable username lookup
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().unique(), // Supabase user UUID
  username: text("username").notNull().unique(), // Unique username for login
  email: text("email").notNull().unique(), // Cached email for lookup
  displayName: text("display_name"), // Optional display name
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prayers = pgTable("prayers", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(), // Supabase user UUID
  section: text("section").notNull(), // 'initium', 'gaudiosa', 'dolorosa', 'gloriosa', 'ultima'
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const intentions = pgTable("intentions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(), // Supabase user UUID
  text: text("text").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customPrayers = pgTable("custom_prayers", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(), // Supabase user UUID
  title: text("title").notNull(),
  content: text("content").notNull(),
  section: text("section").notNull(), // 'initium' or 'ultima'
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPrayerSchema = createInsertSchema(prayers).omit({
  id: true,
  completedAt: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntentionSchema = createInsertSchema(intentions).omit({
  id: true,
  createdAt: true,
});

export const insertCustomPrayerSchema = createInsertSchema(customPrayers).omit({
  id: true,
  createdAt: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertPrayer = z.infer<typeof insertPrayerSchema>;
export type Prayer = typeof prayers.$inferSelect;
export type InsertIntention = z.infer<typeof insertIntentionSchema>;
export type Intention = typeof intentions.$inferSelect;
export type InsertCustomPrayer = z.infer<typeof insertCustomPrayerSchema>;
export type CustomPrayer = typeof customPrayers.$inferSelect;
