import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  birthDate: text("birth_date"),
  country: text("country"),
  objective: text("objective"),
  capital: text("capital"),
  maritalStatus: text("marital_status"),
  citizenship: text("citizenship"),
  education: text("education"),
  graduationYear: integer("graduation_year"),
  institution: text("institution"),
  fieldOfStudy: text("field_of_study"),
  experience: text("experience"),
  currentPosition: text("current_position"),
  hasLeadership: text("has_leadership"),
  hasRecognition: text("has_recognition"),
  familyInUS: text("family_in_us"),
  jobOffer: text("job_offer"),
  companyTransfer: text("company_transfer"),
  howFoundUs: text("how_found_us"),
  totalScore: integer("total_score").notNull(),
  formData: jsonb("form_data"),
  visaRecommendations: jsonb("visa_recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
