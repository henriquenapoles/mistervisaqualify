import { type User, type InsertUser, type Lead, type InsertLead } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<string, Lead>;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { 
      fullName: insertLead.fullName,
      email: insertLead.email,
      phone: insertLead.phone,
      birthDate: insertLead.birthDate || null,
      country: insertLead.country || null,
      objective: insertLead.objective || null,
      capital: insertLead.capital || null,
      maritalStatus: insertLead.maritalStatus || null,
      citizenship: insertLead.citizenship || null,
      education: insertLead.education || null,
      graduationYear: insertLead.graduationYear || null,
      institution: insertLead.institution || null,
      fieldOfStudy: insertLead.fieldOfStudy || null,
      experience: insertLead.experience || null,
      currentPosition: insertLead.currentPosition || null,
      hasLeadership: insertLead.hasLeadership || null,
      hasRecognition: insertLead.hasRecognition || null,
      familyInUS: insertLead.familyInUS || null,
      jobOffer: insertLead.jobOffer || null,
      companyTransfer: insertLead.companyTransfer || null,
      howFoundUs: insertLead.howFoundUs || null,
      totalScore: insertLead.totalScore,
      formData: insertLead.formData || null,
      visaRecommendations: insertLead.visaRecommendations || null,
      id, 
      createdAt: new Date() 
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }
}

export const storage = new MemStorage();
