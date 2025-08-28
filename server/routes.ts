import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit lead data
  app.post("/api/leads", async (req, res) => {
    try {
      // Create a more flexible schema for validation
      const flexibleLeadData = {
        fullName: req.body.fullName || "",
        email: req.body.email || "",
        phone: req.body.phone || "",
        birthDate: req.body.birthDate,
        country: req.body.country || "brasil",
        objective: req.body.objective,
        capital: req.body.capital,
        maritalStatus: req.body.maritalStatus || "solteiro",
        citizenship: req.body.citizenship || "nao",
        education: req.body.education,
        graduationYear: req.body.graduationYear,
        institution: req.body.institution,
        fieldOfStudy: req.body.fieldOfStudy,
        experience: req.body.experience,
        currentPosition: req.body.currentPosition,
        hasLeadership: req.body.hasLeadership || "nao",
        hasRecognition: req.body.hasRecognition || "nao",
        familyInUS: req.body.familyInUS,
        jobOffer: req.body.jobOffer,
        companyTransfer: req.body.companyTransfer,
        howFoundUs: req.body.howFoundUs,
        totalScore: req.body.score || req.body.totalScore || req.body.partialScore || 0,
        formData: req.body,
        visaRecommendations: req.body.visaRecommendations || []
      };
      
      const lead = await storage.createLead(flexibleLeadData);
      
      // Submit to webhook
      try {
        const webhookUrl = "https://2n8n.ominicrm.com/webhook-test/ef793db4-4f98-4013-839c-3c965a7b4f2c";
        const webhookPayload = {
          leadId: lead.id,
          formData: lead.formData,
          totalScore: lead.totalScore,
          timestamp: lead.createdAt,
          source: "mastervisa.com.br",
          visaRecommendations: lead.visaRecommendations,
          personalInfo: {
            fullName: lead.fullName,
            email: lead.email,
            phone: lead.phone,
            birthDate: lead.birthDate,
            country: lead.country
          }
        };

        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        });

        if (!webhookResponse.ok) {
          console.error("Webhook submission failed:", webhookResponse.statusText);
        }
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
      }

      res.json({ 
        success: true, 
        leadId: lead.id,
        totalScore: lead.totalScore,
        visaRecommendations: lead.visaRecommendations
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          error: "Internal server error" 
        });
      }
    }
  });

  // Get lead data (for testing)
  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        res.status(404).json({ error: "Lead not found" });
        return;
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
