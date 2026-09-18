import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPrayerSchema, insertIntentionSchema, insertUserProfileSchema, insertCustomPrayerSchema } from "@shared/schema";
import { fetchDailyLiturgy } from "./lib/liturgyParser";
import { bookMetadataResolver } from "./lib/bookMetadata/BookMetadataResolver";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Liturgy of the Day (Missale Romanum 1962 / Irmandade do Carmo)
  app.get("/api/liturgy", async (req, res) => {
    try {
      const dateParam = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const data = await fetchDailyLiturgy(dateParam);
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200');
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch daily liturgy:", error);
      res.status(500).json({ message: "Failed to fetch daily liturgy" });
    }
  });
  // Prayer routes
  app.get("/api/prayers/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // Now using string userId from Supabase
      const prayers = await storage.getUserPrayers(userId);
      res.json(prayers);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch prayers" });
    }
  });

  app.post("/api/prayers", async (req, res) => {
    try {
      const prayerData = insertPrayerSchema.parse(req.body);
      const prayer = await storage.createPrayer(prayerData);
      res.json(prayer);
    } catch (error) {
      res.status(400).json({ message: "Invalid prayer data" });
    }
  });

  app.patch("/api/prayers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { completed } = req.body;
      const prayer = await storage.updatePrayerCompleted(id, completed);
      
      if (!prayer) {
        return res.status(404).json({ message: "Prayer not found" });
      }
      
      res.json(prayer);
    } catch (error) {
      res.status(400).json({ message: "Failed to update prayer" });
    }
  });

  // Intention routes
  app.get("/api/intentions/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // Now using string userId from Supabase
      const intentions = await storage.getUserIntentions(userId);
      res.json(intentions);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch intentions" });
    }
  });

  app.post("/api/intentions", async (req, res) => {
    try {
      const intentionData = insertIntentionSchema.parse(req.body);
      const intention = await storage.createIntention(intentionData);
      res.json(intention);
    } catch (error) {
      res.status(400).json({ message: "Invalid intention data" });
    }
  });

  app.delete("/api/intentions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userId } = req.body; // userId is now a string from Supabase
      const deleted = await storage.deleteIntention(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Intention not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete intention" });
    }
  });

  // Custom Prayer routes
  app.get("/api/custom-prayers/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const customPrayers = await storage.getUserCustomPrayers(userId);
      res.json(customPrayers);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch custom prayers" });
    }
  });

  app.post("/api/custom-prayers", async (req, res) => {
    try {
      const prayerData = insertCustomPrayerSchema.parse(req.body);
      const prayer = await storage.createCustomPrayer(prayerData);
      res.json(prayer);
    } catch (error) {
      res.status(400).json({ message: "Invalid custom prayer data" });
    }
  });

  app.patch("/api/custom-prayers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userId, ...updates } = req.body;
      const prayer = await storage.updateCustomPrayer(id, userId, updates);
      
      if (!prayer) {
        return res.status(404).json({ message: "Custom prayer not found" });
      }
      
      res.json(prayer);
    } catch (error) {
      res.status(400).json({ message: "Failed to update custom prayer" });
    }
  });

  app.delete("/api/custom-prayers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userId } = req.body;
      const deleted = await storage.deleteCustomPrayer(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Custom prayer not found" });
      }
      
      res.json({ message: "Custom prayer deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete custom prayer" });
    }
  });

  // User Profile Routes
  app.post("/api/user-profiles", async (req, res) => {
    try {
      console.log("Received profile data:", JSON.stringify(req.body, null, 2));
      const profileData = insertUserProfileSchema.parse(req.body);
      console.log("Validated profile data:", JSON.stringify(profileData, null, 2));
      const profile = await storage.createUserProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Profile creation error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(400).json({ message: "Invalid profile data", error: String(error) });
      }
    }
  });

  app.get("/api/user-profiles/username/:username", async (req, res) => {
    try {
      const username = req.params.username;
      const profile = await storage.getUserProfileByUsername(username);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch profile" });
    }
  });

  app.get("/api/user-profiles/email/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const profile = await storage.getUserProfileByEmail(email);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch profile" });
    }
  });

  // Email lookup route for username login
  app.get("/api/auth/email-by-username/:username", async (req, res) => {
    try {
      const username = req.params.username;
      console.log(`Looking up email for username: ${username}`);
      const profile = await storage.getUserProfileByUsername(username);
      console.log(`Profile found:`, profile ? 'yes' : 'no');
      
      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ email: profile.email });
    } catch (error) {
      console.error("Username lookup error:", error);
      res.status(400).json({ message: "Failed to lookup email", error: String(error) });
    }
  });

  // Bibliotheca: Real ISBN Book Metadata Lookup
  app.get("/api/bibliotheca/isbn/:isbn", async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const result = await bookMetadataResolver.resolve(isbn);
      if ("error" in result && result.error === "provider_unavailable") {
        return res.status(503).json(result);
      }
      return res.json(result);
    } catch (error) {
      console.error("[ISBN Lookup Error]:", error);
      return res.status(503).json({ error: "provider_unavailable" });
    }
  });

  // Bibliotheca: Dev-only Vision Benchmark Latest Report
  app.get("/api/dev/vision-benchmark/latest", async (_req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const reportPath = path.join(process.cwd(), "artifacts", "vision-benchmark", "latest.json");
      if (!fs.existsSync(reportPath)) {
        return res.status(404).json({ message: "No benchmark report found. Run npm run benchmark:vision first." });
      }
      const data = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
