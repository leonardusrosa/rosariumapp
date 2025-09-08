// Vercel serverless function for all API routes
import { storage } from './storage.js';
import { z } from 'zod';

// Define schemas directly for Vercel
const insertPrayerSchema = z.object({
  userId: z.string().uuid(),
  section: z.string(),
  completed: z.boolean().optional()
});

const insertIntentionSchema = z.object({
  userId: z.string().uuid(),
  text: z.string(),
  isActive: z.boolean().optional()
});

const insertUserProfileSchema = z.object({
  userId: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  displayName: z.string().optional()
});

const insertCustomPrayerSchema = z.object({
  userId: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  section: z.string(),
  isActive: z.boolean().optional()
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  
  // Debug logging for Vercel
  console.log(`[Vercel API] ${method} ${url}`);
  
  try {
    // Prayer routes
    if (url.match(/\/api\/prayers\/[^\/]+$/) && method === 'GET') {
      const userId = url.split('/').pop();
      const prayers = await storage.getUserPrayers(userId);
      return res.json(prayers);
    }
    
    if (url === '/api/prayers' && method === 'POST') {
      const prayerData = insertPrayerSchema.parse(req.body);
      const prayer = await storage.createPrayer(prayerData);
      return res.json(prayer);
    }
    
    if (url.match(/\/api\/prayers\/\d+$/) && method === 'PATCH') {
      const id = parseInt(url.split('/').pop());
      const { completed } = req.body;
      const prayer = await storage.updatePrayerCompleted(id, completed);
      
      if (!prayer) {
        return res.status(404).json({ message: "Prayer not found" });
      }
      
      return res.json(prayer);
    }
    
    // Intention routes
    if (url.match(/\/api\/intentions\/[^\/]+$/) && method === 'GET') {
      const userId = url.split('/').pop();
      const intentions = await storage.getUserIntentions(userId);
      return res.json(intentions);
    }
    
    if (url === '/api/intentions' && method === 'POST') {
      const intentionData = insertIntentionSchema.parse(req.body);
      const intention = await storage.createIntention(intentionData);
      return res.json(intention);
    }
    
    if (url.match(/\/api\/intentions\/\d+$/) && method === 'DELETE') {
      const id = parseInt(url.split('/').pop());
      const { userId } = req.body;
      const deleted = await storage.deleteIntention(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Intention not found" });
      }
      
      return res.json({ success: true });
    }
    
    // Custom Prayer routes
    if (url.match(/\/api\/custom-prayers\/[^\/]+$/) && method === 'GET') {
      const userId = url.split('/').pop();
      const customPrayers = await storage.getUserCustomPrayers(userId);
      return res.json(customPrayers);
    }
    
    if (url === '/api/custom-prayers' && method === 'POST') {
      const prayerData = insertCustomPrayerSchema.parse(req.body);
      const prayer = await storage.createCustomPrayer(prayerData);
      return res.json(prayer);
    }
    
    if (url.match(/\/api\/custom-prayers\/\d+$/) && method === 'PATCH') {
      const id = parseInt(url.split('/').pop());
      const { userId, ...updates } = req.body;
      const prayer = await storage.updateCustomPrayer(id, userId, updates);
      
      if (!prayer) {
        return res.status(404).json({ message: "Custom prayer not found" });
      }
      
      return res.json(prayer);
    }
    
    if (url.match(/\/api\/custom-prayers\/\d+$/) && method === 'DELETE') {
      const id = parseInt(url.split('/').pop());
      const { userId } = req.body;
      const deleted = await storage.deleteCustomPrayer(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Custom prayer not found" });
      }
      
      return res.json({ message: "Custom prayer deleted successfully" });
    }
    
    // User Profile Routes
    if (url === '/api/user-profiles' && method === 'POST') {
      const profileData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(profileData);
      return res.json(profile);
    }
    
    if (url.match(/\/api\/user-profiles\/username\/[^\/]+$/) && method === 'GET') {
      const username = url.split('/').pop();
      const profile = await storage.getUserProfileByUsername(username);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      return res.json(profile);
    }
    
    if (url.match(/\/api\/user-profiles\/email\/[^\/]+$/) && method === 'GET') {
      const email = url.split('/').pop();
      const profile = await storage.getUserProfileByEmail(email);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      return res.json(profile);
    }
    
    // Email lookup route for username login - THIS IS THE MISSING ROUTE
    if (url.includes('/api/auth/email-by-username/') && method === 'GET') {
      const urlParts = url.split('/');
      const username = urlParts[urlParts.length - 1];
      console.log(`Looking up email for username: ${username}`);
      const profile = await storage.getUserProfileByUsername(username);
      console.log(`Profile found:`, profile ? 'yes' : 'no');
      
      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json({ email: profile.email });
    }
    
    // Default response for unmatched routes
    console.log(`[Vercel API] Route not found: ${method} ${url}`);
    return res.status(404).json({ message: 'Not Found', url, method });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: String(error) });
  }
}