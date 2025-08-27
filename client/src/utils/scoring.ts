import { LeadFormData } from '../types/form';

export function calculateScore(formData: LeadFormData): number {
  let score = 0;

  // Objective scoring
  const objectiveScores: Record<string, number> = {
    'trabalho': 10,
    'estudo': 8,
    'investimento': 15,
    'familia': 12,
    'turismo': 0,
    'outro': 0
  };
  score += objectiveScores[formData.objective || ''] || 0;

  // Capital scoring
  const capitalScores: Record<string, number> = {
    'menos-20k': 0,
    '20k-500k': 5,
    '500k-1m': 10,
    'mais-1m': 20
  };
  score += capitalScores[formData.capital || ''] || 0;

  // Family in US
  if (formData.familyInUS === 'sim') score += 10;

  // Education scoring
  const educationScores: Record<string, number> = {
    'ensino-medio': 0,
    'graduacao': 5,
    'pos': 8,
    'mestrado': 10,
    'doutorado': 15
  };
  score += educationScores[formData.education || ''] || 0;

  // English proficiency
  const englishScores: Record<string, number> = {
    'basico': 0,
    'intermediario': 3,
    'avancado': 5,
    'fluente': 8
  };
  score += englishScores[formData.englishLevel || ''] || 0;

  // Experience scoring
  const experienceScores: Record<string, number> = {
    'menos-1': 0,
    '1-5': 5,
    '5-10': 8,
    '10-plus': 10
  };
  score += experienceScores[formData.experience || ''] || 0;

  // Leadership
  if (formData.hasLeadership === 'sim') score += 5;

  // Recognition (major bonus)
  if (formData.hasRecognition === 'sim') score += 25;

  // Job offer (major bonus)
  if (formData.jobOffer === 'sim') score += 20;

  // Company transfer
  if (formData.companyTransfer === 'sim') score += 10;

  // Citizenship bonus
  if (formData.citizenship === 'sim') score += 5;

  // Certifications (estimate 2 points per certification, max 6)
  if (formData.certifications) {
    const certCount = formData.certifications.split(',').length;
    score += Math.min(certCount * 2, 6);
  }

  return score;
}
